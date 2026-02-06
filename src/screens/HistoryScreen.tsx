import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppData } from '../hooks/useAppData';
import { useI18n } from '../i18n';
import { RelapseEvent, RelapseTrigger } from '../types';
import { formatDisplayDateWithYear } from '../utils/date';

export function HistoryScreen() {
  const { data } = useAppData();
  const { t } = useI18n();

  // Sort relapses by timestamp descending (most recent first)
  const sortedRelapses = [...data.relapses].sort((a, b) => b.timestamp - a.timestamp);

  const renderItem = ({ item }: { item: RelapseEvent }) => {
    const triggerText = item.trigger
      ? item.trigger === 'other' && item.triggerNote
        ? item.triggerNote
        : t.trigger[item.trigger as RelapseTrigger]
      : null;

    return (
      <View style={styles.recordItem}>
        <View style={styles.recordHeader}>
          <Text style={styles.recordDate}>{formatDisplayDateWithYear(item.timestamp)}</Text>
          <Text style={styles.streakInfo}>
            {t.history.streakWas} {item.streakDays} {t.history.days}
          </Text>
        </View>
        {triggerText && (
          <Text style={styles.triggerText}>{triggerText}</Text>
        )}
      </View>
    );
  };

  if (sortedRelapses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t.history.noRelapses}</Text>
        <Text style={styles.emptySubtext}>{t.history.keepGoing}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedRelapses}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp.toString()}
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
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordDate: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  streakInfo: {
    fontSize: 14,
    color: '#999',
  },
  triggerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
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
