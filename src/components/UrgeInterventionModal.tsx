import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Contract, ContractStats } from '../types';
import { useI18n } from '../i18n';
import { COPING_STRATEGIES } from '../utils/punishment';

interface Props {
  visible: boolean;
  contract: Contract | null;
  stats: ContractStats | null;
  onClose: () => void;
  onResisted: () => void;
  onFailed: () => void;
}

export function UrgeInterventionModal({ visible, contract, stats, onClose, onResisted, onFailed }: Props) {
  const { t, locale } = useI18n();

  if (!contract) return null;

  const getBehaviorName = () => {
    if (contract.behavior === 'custom') {
      return contract.behaviorCustomName || t.contract.custom;
    }
    return t.contract.behaviors[contract.behavior];
  };

  const getPunishmentText = () => {
    if (contract.punishmentLevel === 'light' && contract.selfPenaltyTask) {
      return t.contract.selfPenalties[contract.selfPenaltyTask];
    }
    if (contract.punishmentLevel === 'medium' && contract.donationCategory) {
      return `${t.contract.donations[contract.donationCategory]} ¥${contract.donationAmount?.toLocaleString() || ''}`;
    }
    return '';
  };

  const currentStreak = stats?.currentStreak || 0;
  const streakUnit = contract.granularity === 'day' ? t.home.days : t.home.blocks;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t.urge.waitTitle}</Text>

          {/* Contract reminder */}
          <View style={styles.reminderBox}>
            <Text style={styles.sectionLabel}>{t.urge.yourContract}</Text>
            <Text style={styles.behaviorName}>{getBehaviorName()}</Text>
            <Text style={styles.streakText}>
              {currentStreak} {streakUnit}
            </Text>
          </View>

          {/* Punishment reminder */}
          <View style={styles.punishmentBox}>
            <Text style={styles.sectionLabel}>{t.urge.ifYouFail}</Text>
            <Text style={styles.punishmentText}>{getPunishmentText()}</Text>
          </View>

          {/* Coping strategies */}
          <View style={styles.copingSection}>
            <Text style={styles.sectionLabel}>{t.urge.tryInstead}</Text>
            {COPING_STRATEGIES.map((strategy) => (
              <View key={strategy.key} style={styles.copingItem}>
                <Text style={styles.copingText}>
                  {locale === 'ja' ? strategy.nameJa : strategy.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <TouchableOpacity style={styles.resistedButton} onPress={onResisted}>
            <Text style={styles.resistedButtonText}>{t.urge.resisted}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.failedButton} onPress={onFailed}>
            <Text style={styles.failedButtonText}>{t.urge.failed}</Text>
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
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
  },
  reminderBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  behaviorName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  streakText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  punishmentBox: {
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  punishmentText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D33',
  },
  copingSection: {
    marginBottom: 24,
  },
  copingItem: {
    backgroundColor: '#F0FFF0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  copingText: {
    fontSize: 16,
    color: '#2A662A',
  },
  resistedButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  resistedButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  failedButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  failedButtonText: {
    fontSize: 16,
    color: '#999',
  },
});
