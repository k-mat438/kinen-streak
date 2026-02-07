import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useI18n } from '../i18n';

interface Props {
  visible: boolean;
  behaviorName: string;
  streakCount: number;
  granularity: 'day' | 'hour';
  onRetry: () => void;
  onStartOver: () => void;
}

export function GoalCompletedModal({
  visible,
  behaviorName,
  streakCount,
  granularity,
  onRetry,
  onStartOver,
}: Props) {
  const { t } = useI18n();

  const handleShare = async () => {
    const unit = granularity === 'day' ? t.home.days : t.home.blocks;
    const message = t.goal.shareMessage
      .replace('{behavior}', behaviorName)
      .replace('{count}', streakCount.toString())
      .replace('{unit}', unit);

    try {
      await Share.share({
        message,
      });
    } catch (error) {
      // User cancelled or error
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>{t.goal.completed}</Text>
          <Text style={styles.subtitle}>{t.goal.congratulations}</Text>

          <View style={styles.statsBox}>
            <Text style={styles.statsLabel}>{behaviorName}</Text>
            <Text style={styles.statsValue}>
              {streakCount} {granularity === 'day' ? t.home.days : t.home.blocks}
            </Text>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>{t.goal.shareToSns}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>{t.goal.tryAgain}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.startOverButton} onPress={onStartOver}>
            <Text style={styles.startOverButtonText}>{t.goal.startOver}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  shareButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  retryButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  startOverButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  startOverButtonText: {
    fontSize: 14,
    color: '#999',
  },
});
