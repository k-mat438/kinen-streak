import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAppData } from '../hooks/useAppData';
import { useI18n } from '../i18n';
import { RelapseTriggerModal } from '../components/RelapseTriggerModal';
import { StartChallengeModal } from '../components/StartChallengeModal';
import { ElapsedTimer } from '../components/ElapsedTimer';

export function HomeScreen() {
  const { stats, data, isStarted, startChallenge, recordRelapse } = useAppData();
  const { t } = useI18n();
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);

  const handleRelapse = () => {
    setShowTriggerModal(true);
  };

  const handleStartPress = () => {
    setShowStartModal(true);
  };

  // Calculate goal progress
  const daysLeft = Math.max(0, data.goalDays - stats.currentStreak);
  const goalReached = stats.currentStreak >= data.goalDays;
  const progressPercent = Math.min(100, (stats.currentStreak / data.goalDays) * 100);

  // Not started yet - show start button
  if (!isStarted) {
    return (
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <Text style={styles.welcomeTitle}>{t.home.welcomeTitle}</Text>
          <Text style={styles.welcomeSubtitle}>{t.home.welcomeSubtitle}</Text>
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPress}
          >
            <Text style={styles.startButtonText}>{t.home.startChallenge}</Text>
          </TouchableOpacity>
        </View>

        {/* Start Challenge Modal */}
        <StartChallengeModal
          visible={showStartModal}
          onClose={() => setShowStartModal(false)}
          onSubmit={async (reason, goalDays) => {
            await startChallenge(reason, goalDays);
            setShowStartModal(false);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Elapsed Time Timer */}
        <ElapsedTimer startTimestamp={data.startTimestamp} />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Goal Progress */}
        <View style={styles.goalContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalLabel}>{t.home.goalProgress}</Text>
            <Text style={styles.goalText}>
              {goalReached ? t.home.goalReached : `${daysLeft} ${t.home.daysLeft}`}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.bestStreak}</Text>
            <Text style={styles.statLabel}>{t.home.bestStreak}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalCleanDays}</Text>
            <Text style={styles.statLabel}>{t.home.totalCleanDays}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.relapseCount}</Text>
            <Text style={styles.statLabel}>{t.home.relapses}</Text>
          </View>
        </View>

        {/* Relapse Button */}
        <TouchableOpacity
          style={styles.relapseButton}
          onPress={handleRelapse}
        >
          <Text style={styles.relapseButtonText}>{t.home.iSmoked}</Text>
        </TouchableOpacity>

        {/* Motivation line */}
        <Text style={styles.motivationText}>{t.home.motivationText}</Text>
      </View>

      {/* Relapse Trigger Modal */}
      <RelapseTriggerModal
        visible={showTriggerModal}
        onClose={() => setShowTriggerModal(false)}
        onSubmit={async (trigger, note, recovery) => {
          await recordRelapse(trigger, note, recovery);
          setShowTriggerModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  goalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalLabel: {
    fontSize: 14,
    color: '#999',
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
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
  relapseButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  relapseButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  motivationText: {
    textAlign: 'center',
    color: '#CCC',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
