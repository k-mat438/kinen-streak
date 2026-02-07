import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SelfPenaltyTask } from '../types';
import { useI18n } from '../i18n';
import { getSelfPenaltyInfo } from '../utils/punishment';

interface Props {
  task: SelfPenaltyTask;
  customDescription?: string;
  onCompleted?: () => void;
}

export function SelfPenaltyCard({ task, customDescription, onCompleted }: Props) {
  const { t, locale } = useI18n();
  const penaltyInfo = getSelfPenaltyInfo(task);

  if (!penaltyInfo) return null;

  const name = locale === 'ja' ? penaltyInfo.nameJa : penaltyInfo.name;
  const amount = locale === 'ja' ? penaltyInfo.defaultAmountJa : penaltyInfo.defaultAmount;

  const displayName = task === 'custom' && customDescription ? customDescription : name;
  const displayAmount = task === 'custom' ? '' : amount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.punishment.selfPenaltyRequired}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.taskName}>{displayName}</Text>
        {displayAmount ? <Text style={styles.taskAmount}>{displayAmount}</Text> : null}
      </View>

      {onCompleted && (
        <TouchableOpacity style={styles.doneButton} onPress={onCompleted}>
          <Text style={styles.doneButtonText}>{t.punishment.penaltyComplete}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  taskName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  taskAmount: {
    fontSize: 16,
    color: '#666',
  },
  doneButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
