import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppData } from '../hooks/useAppData';
import { useI18n } from '../i18n';
import { DayRecord, RelapseTrigger } from '../types';
import { formatDisplayDate } from '../utils/date';

export function HistoryScreen() {
  const { data } = useAppData();
  const { t } = useI18n();

  // Sort records by date descending
  const sortedRecords = Object.values(data.records)
    .filter((record) => record.status !== 'unknown')
    .sort((a, b) => b.date.localeCompare(a.date));

  const renderItem = ({ item }: { item: DayRecord }) => {
    const isSmokeFree = item.status === 'smoke-free';
    const triggerText = item.trigger
      ? item.trigger === 'other' && item.triggerNote
        ? item.triggerNote
        : t.trigger[item.trigger as RelapseTrigger]
      : null;

    return (
      <View style={styles.recordItem}>
        <View style={styles.recordLeft}>
          <Text style={styles.recordDate}>{formatDisplayDate(item.date)}</Text>
        </View>
        <View style={styles.recordRight}>
          <View style={styles.statusRow}>
            <Text style={[styles.statusIcon, isSmokeFree && styles.smokeFreeIcon]}>
              {isSmokeFree ? '✓' : '✗'}
            </Text>
            <Text style={styles.statusText}>
              {isSmokeFree ? t.history.smokeFree : t.history.relapse}
            </Text>
          </View>
          {triggerText && (
            <Text style={styles.triggerText}>— {triggerText}</Text>
          )}
        </View>
      </View>
    );
  };

  if (sortedRecords.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t.history.noRecords}</Text>
        <Text style={styles.emptySubtext}>{t.history.startTracking}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedRecords}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContent: {
    padding: 16,
    paddingTop: 24,
  },
  recordItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  recordLeft: {
    width: 70,
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  recordRight: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
    color: '#E74C3C',
    marginRight: 8,
    fontWeight: '600',
  },
  smokeFreeIcon: {
    color: '#27AE60',
  },
  statusText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  triggerText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    marginLeft: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
  },
});
