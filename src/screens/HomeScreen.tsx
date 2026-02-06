import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useAppData } from '../hooks/useAppData';
import { useI18n } from '../i18n';
import { formatBoundaryTime } from '../utils/date';
import { RelapseTriggerModal } from '../components/RelapseTriggerModal';

export function HomeScreen() {
  const { stats, todayRecord, data, recordSmokeFree, recordRelapse } = useAppData();
  const { t } = useI18n();
  const [showTriggerModal, setShowTriggerModal] = useState(false);

  const isRecorded = todayRecord !== null;
  const isSmokeFree = todayRecord?.status === 'smoke-free';
  const isRelapse = todayRecord?.status === 'relapse';

  const handleSmokeFree = async () => {
    if (isRelapse) {
      Alert.alert(
        t.home.changeRecordTitle,
        t.home.changeRecordMessage,
        [
          { text: t.common.cancel, style: 'cancel' },
          {
            text: t.common.change,
            onPress: async () => {
              await recordSmokeFree();
            },
          },
        ]
      );
    } else {
      await recordSmokeFree();
    }
  };

  const handleRelapse = () => {
    setShowTriggerModal(true);
  };

  const boundaryTime = formatBoundaryTime(
    data.settings.dayBoundaryHour,
    data.settings.dayBoundaryMinute
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Current Streak - Main Display */}
      <View style={styles.streakContainer}>
        <Text style={styles.streakNumber}>{stats.currentStreak}</Text>
        <Text style={styles.streakLabel}>
          {stats.currentStreak === 0 ? t.home.newStartToday : t.home.daysSmokeFree}
        </Text>
      </View>

      {/* Today's Input Section */}
      <View style={styles.inputSection}>
        {!isRecorded && (
          <Text style={styles.inputHint}>{t.home.notRecordedToday}</Text>
        )}

        {isRecorded ? (
          <View style={styles.recordedContainer}>
            <Text style={styles.recordedText}>
              {isSmokeFree ? t.home.recordedSmokeFree : t.home.recordedRelapse}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.changeButton]}
                onPress={handleSmokeFree}
              >
                <Text style={styles.changeButtonText}>
                  {isSmokeFree ? t.home.recorded : t.home.changeToSmokeFree}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.changeButton]}
                onPress={handleRelapse}
              >
                <Text style={styles.changeButtonText}>
                  {isRelapse ? t.home.recorded : t.home.changeToRelapse}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.smokeFreeButton]}
              onPress={handleSmokeFree}
            >
              <Text style={styles.actionButtonText}>{t.home.smokeFreeToday}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.relapseButton]}
              onPress={handleRelapse}
            >
              <Text style={styles.relapseButtonText}>{t.home.relapseToday}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.bestStreak}</Text>
          <Text style={styles.statLabel}>{t.home.bestStreak}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalSmokeFree}</Text>
          <Text style={styles.statLabel}>{t.home.totalSmokeFree}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.relapseCount}</Text>
          <Text style={styles.statLabel}>{t.home.relapses}</Text>
        </View>
      </View>

      {/* Day Boundary Hint */}
      <Text style={styles.boundaryHint}>{t.home.dayResetsAt} {boundaryTime}</Text>

      {/* Motivation line (single, unchanging) */}
      <Text style={styles.motivationText}>{t.home.motivationText}</Text>

      {/* Relapse Trigger Modal */}
      <RelapseTriggerModal
        visible={showTriggerModal}
        onClose={() => setShowTriggerModal(false)}
        onSubmit={async (trigger, note) => {
          await recordRelapse(trigger, note);
          setShowTriggerModal(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  streakNumber: {
    fontSize: 120,
    fontWeight: '200',
    color: '#1A1A1A',
    lineHeight: 130,
  },
  streakLabel: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 40,
  },
  inputHint: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 16,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  smokeFreeButton: {
    backgroundColor: '#1A1A1A',
  },
  relapseButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  relapseButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  recordedContainer: {
    alignItems: 'center',
  },
  recordedText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  changeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#666',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
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
  },
  boundaryHint: {
    textAlign: 'center',
    color: '#BBB',
    fontSize: 12,
    marginBottom: 16,
  },
  motivationText: {
    textAlign: 'center',
    color: '#CCC',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
