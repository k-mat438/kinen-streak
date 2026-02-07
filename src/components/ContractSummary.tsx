import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Contract } from '../types';
import { useI18n } from '../i18n';
import { formatBlockDuration } from '../utils/date';

interface Props {
  contract: Contract;
}

export function ContractSummary({ contract }: Props) {
  const { t } = useI18n();

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
    return t.contract.lightPunishment;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{t.contract.targetBehavior}</Text>
        <Text style={styles.value}>{getBehaviorName()}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t.contract.trackingMode}</Text>
        <Text style={styles.value}>
          {contract.granularity === 'day'
            ? t.contract.dayMode
            : `${formatBlockDuration(contract.blockDurationMinutes || 60)}`}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t.contract.ifYouFail}</Text>
        <Text style={styles.value}>{getPunishmentText()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#999',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    maxWidth: '60%',
    textAlign: 'right',
  },
});
