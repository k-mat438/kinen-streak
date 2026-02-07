import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useI18n } from '../i18n';

interface Props {
  successRate: number;
  totalSuccesses: number;
  failureCount: number;
}

export function SuccessRateDisplay({ successRate, totalSuccesses, failureCount }: Props) {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <View style={styles.rateCard}>
        <Text style={styles.rateLabel}>{t.home.successRate}</Text>
        <Text style={styles.rateValue}>{successRate}%</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalSuccesses}</Text>
          <Text style={styles.statLabel}>{t.home.totalSuccesses}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{failureCount}</Text>
          <Text style={styles.statLabel}>{t.home.failures}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  rateCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  rateLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
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
});
