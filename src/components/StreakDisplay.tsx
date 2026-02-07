import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ContractGranularity } from '../types';
import { useI18n } from '../i18n';

interface Props {
  streak: number;
  granularity: ContractGranularity;
}

export function StreakDisplay({ streak, granularity }: Props) {
  const { t } = useI18n();

  const label = granularity === 'day' ? t.home.days : t.home.blocks;

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{streak}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  value: {
    fontSize: 140,
    fontWeight: '200',
    color: '#1A1A1A',
    lineHeight: 150,
  },
  label: {
    fontSize: 20,
    color: '#666',
    marginTop: 8,
  },
});
