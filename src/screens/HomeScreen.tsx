import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Switch,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import { useAppData } from '../hooks/useAppData';
import { useI18n } from '../i18n';
import { CreateContractModal } from '../components/CreateContractModal';
import { FailureModal } from '../components/FailureModal';
import { UrgeInterventionModal } from '../components/UrgeInterventionModal';
import { GoalCompletedModal } from '../components/GoalCompletedModal';
import { StreakDisplay } from '../components/StreakDisplay';
import { TimerDisplay } from '../components/TimerDisplay';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export function HomeScreen() {
  const {
    data,
    contractStats,
    hasContract,
    createContract,
    recordFailure,
    markPunishmentExecuted,
    endContract,
    restartSameContract,
  } = useAppData();
  const { t } = useI18n();

  const [showContractModal, setShowContractModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [showGoalCompletedModal, setShowGoalCompletedModal] = useState(false);
  const [latestFailureId, setLatestFailureId] = useState<string | null>(null);
  const [showRemaining, setShowRemaining] = useState(false);

  const contract = data.contract;

  // Random "try instead" actions for urge button (pick 2)
  const randomUrgeActions = useMemo(() => {
    const actions = [...t.recovery.urgeActions];
    // Shuffle and pick 2
    for (let i = actions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [actions[i], actions[j]] = [actions[j], actions[i]];
    }
    return actions.slice(0, 2);
  }, [t]);

  // Preload success sound for instant playback
  const successPlayer = useAudioPlayer(require('../../assets/success.mp3'));

  // Schedule notification when contract exists and goal not yet reached
  useEffect(() => {
    if (!contract) return;
    if (!data.settings.notificationsEnabled) {
      // Cancel any existing notifications if disabled
      Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }

    const targetTimestamp = contract.granularity === 'hour' && contract.blockDurationMinutes
      ? contract.startedAt + contract.blockDurationMinutes * 60 * 1000
      : contract.startedAt + (contract.durationDays || 30) * 24 * 60 * 60 * 1000;

    const now = Date.now();
    if (now < targetTimestamp) {
      // Goal not yet reached, schedule notification
      scheduleGoalNotification(targetTimestamp);
    }

    // Cleanup: cancel notifications when contract changes or component unmounts
    return () => {
      Notifications.cancelAllScheduledNotificationsAsync();
    };
  }, [contract?.startedAt, contract?.blockDurationMinutes, contract?.durationDays, data.settings.notificationsEnabled]);

  const handleUrgePress = () => {
    setShowUrgeModal(true);
  };

  const handleFailurePress = () => {
    if (data.settings.vibrationEnabled) {
      Vibration.vibrate(100);
    }
    setShowFailureModal(true);
  };

  const handleUrgeResisted = () => {
    setShowUrgeModal(false);
  };

  const handleUrgeFailed = () => {
    setShowUrgeModal(false);
    setShowFailureModal(true);
  };

  const handleFailureSubmit = async (trigger?: string, note?: string) => {
    await recordFailure(trigger as any, note);
    // Get the latest failure ID
    const failures = data.failures;
    if (failures.length > 0) {
      setLatestFailureId(failures[failures.length - 1]?.id || null);
    }
  };

  const handlePunishmentComplete = async () => {
    if (latestFailureId) {
      await markPunishmentExecuted(latestFailureId);
      setLatestFailureId(null);
    }
  };

  const handleRetry = async () => {
    setShowGoalCompletedModal(false);
    await restartSameContract();
  };

  const handleStartOver = async () => {
    setShowGoalCompletedModal(false);
    await endContract();
    setShowContractModal(true);
  };

  const handleCreateContract = async (params: Parameters<typeof createContract>[0]) => {
    await createContract(params);
    setShowContractModal(false);
  };

  const getBehaviorDisplayName = () => {
    if (!contract) return '';
    if (contract.behavior === 'custom') {
      return contract.behaviorCustomName || t.contract.custom;
    }
    return t.contract.behaviors[contract.behavior];
  };

  const getTargetTimestamp = () => {
    if (!contract) return undefined;
    if (contract.granularity === 'hour' && contract.blockDurationMinutes) {
      return contract.startedAt + contract.blockDurationMinutes * 60 * 1000;
    }
    // Day mode: use durationDays or default 30 days
    const days = contract.durationDays || 30;
    return contract.startedAt + days * 24 * 60 * 60 * 1000;
  };

  // Request notification permissions
  const requestNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  // Schedule notification for goal completion
  const scheduleGoalNotification = async (targetTimestamp: number) => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return;
    }

    // Cancel any existing scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    const behaviorName = getBehaviorDisplayName();
    const now = Date.now();
    const secondsUntilGoal = Math.max(1, Math.floor((targetTimestamp - now) / 1000));

    // Schedule notification for when goal is reached
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t.goal.completed,
        body: `${behaviorName} ${t.goal.congratulations}`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsUntilGoal,
      },
    });
    console.log(`Notification scheduled for ${secondsUntilGoal} seconds from now`);
  };

  // Send immediate notification (for when app is in foreground)
  const sendImmediateNotification = async () => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    const behaviorName = getBehaviorDisplayName();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t.goal.completed,
        body: `${behaviorName} ${t.goal.congratulations}`,
        sound: true,
      },
      trigger: null,
    });
  };

  // Play success sound and vibration
  const playSuccessSound = () => {
    // Vibration pattern: short-pause-short-pause-long (celebration pattern)
    if (data.settings.vibrationEnabled) {
      Vibration.vibrate([0, 100, 100, 100, 100, 300]);
    }

    // Send immediate notification (for foreground)
    if (data.settings.notificationsEnabled) {
      sendImmediateNotification();
    }

    // Play preloaded sound instantly
    if (data.settings.soundEnabled) {
      try {
        successPlayer.seekTo(0); // Reset to beginning if already played
        successPlayer.play();
      } catch (error) {
        console.log('Success sound playback error:', error);
      }
    }
  };

  // Check for goal completion
  useEffect(() => {
    if (!contract) return;

    const targetTimestamp = getTargetTimestamp();
    if (!targetTimestamp) return;

    const checkGoal = () => {
      const now = Date.now();
      if (now >= targetTimestamp && !showGoalCompletedModal) {
        setShowGoalCompletedModal(true);
        playSuccessSound();
      }
    };

    checkGoal();
    const interval = setInterval(checkGoal, 1000);

    return () => clearInterval(interval);
  }, [contract, showGoalCompletedModal]);

  // Not started yet - show welcome and start button
  if (!hasContract) {
    return (
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <Text style={styles.welcomeTitle}>{t.home.welcomeTitle}</Text>
          <Text style={styles.welcomeSubtitle}>{t.home.welcomeSubtitle}</Text>
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowContractModal(true)}
          >
            <Text style={styles.startButtonText}>{t.home.createContract}</Text>
          </TouchableOpacity>
        </View>

        <CreateContractModal
          visible={showContractModal}
          onClose={() => setShowContractModal(false)}
          onSubmit={handleCreateContract}
        />
      </View>
    );
  }

  // Active contract - show main UI
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Behavior label */}
        <View style={styles.behaviorLabelContainer}>
          <Text style={styles.behaviorLabel}>{getBehaviorDisplayName()}</Text>
        </View>

        {/* Streak Display */}
        <View style={styles.streakContainer}>
          <StreakDisplay
            streak={contractStats?.currentStreak || 0}
            granularity={contract?.granularity || 'day'}
          />
        </View>

        {/* Timer Display */}
        {contract && (
          <View style={styles.timerContainer}>
            <TimerDisplay
              startTimestamp={contract.startedAt}
              targetTimestamp={getTargetTimestamp()}
              showRemaining={showRemaining}
            />
            <View style={styles.timerToggle}>
              <Text style={styles.timerToggleLabel}>{t.home.showRemaining}</Text>
              <Switch
                value={showRemaining}
                onValueChange={setShowRemaining}
                trackColor={{ false: '#DDD', true: '#1A1A1A' }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Section - Action Buttons */}
      <View style={styles.bottomSection}>
        {/* Urge Button */}
        <TouchableOpacity
          style={styles.urgeButton}
          onPress={handleUrgePress}
        >
          <Text style={styles.urgeButtonText}>{randomUrgeActions.join(' / ')}</Text>
        </TouchableOpacity>

        {/* Failure Button */}
        <TouchableOpacity
          style={styles.failureButton}
          onPress={handleFailurePress}
        >
          <Text style={styles.failureButtonText}>{t.home.iFailed}</Text>
        </TouchableOpacity>
      </View>

      {/* Urge Intervention Modal */}
      <UrgeInterventionModal
        visible={showUrgeModal}
        contract={contract}
        stats={contractStats}
        onClose={() => setShowUrgeModal(false)}
        onResisted={handleUrgeResisted}
        onFailed={handleUrgeFailed}
      />

      {/* Failure Modal */}
      <FailureModal
        visible={showFailureModal}
        contract={contract}
        onClose={() => setShowFailureModal(false)}
        onSubmit={handleFailureSubmit}
        onPunishmentComplete={handlePunishmentComplete}
        onRetry={handleRetry}
        onStartOver={handleStartOver}
      />

      {/* Goal Completed Modal */}
      <GoalCompletedModal
        visible={showGoalCompletedModal}
        behaviorName={getBehaviorDisplayName()}
        streakCount={contractStats?.currentStreak || 0}
        granularity={contract?.granularity || 'day'}
        onRetry={handleRetry}
        onStartOver={handleStartOver}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  startButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  behaviorLabelContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  behaviorLabel: {
    fontSize: 14,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerContainer: {
    marginBottom: 24,
  },
  timerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  timerToggleLabel: {
    fontSize: 14,
    color: '#666',
  },
  urgeButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  urgeButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
  failureButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  failureButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
