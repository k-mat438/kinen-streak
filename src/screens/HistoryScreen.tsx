import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppData } from '../hooks/useAppData';
import { useI18n } from '../i18n';
import { FailureEvent, RelapseTrigger } from '../types';
import { formatDisplayDateWithYear } from '../utils/date';
import { SuccessRateDisplay } from '../components/SuccessRateDisplay';

export function HistoryScreen() {
  const { data, contractStats } = useAppData();
  const { t } = useI18n();

  // Use new failures if contract exists, otherwise use legacy relapses
  const hasContract = data.contract !== null;

  // Sort failures by timestamp descending (most recent first)
  const sortedFailures = [...data.failures].sort((a, b) => b.timestamp - a.timestamp);

  // Sort legacy relapses by timestamp descending
  const sortedRelapses = [...data.relapses].sort((a, b) => b.timestamp - a.timestamp);

  const renderFailureItem = ({ item }: { item: FailureEvent }) => {
    const triggerText = item.trigger
      ? item.trigger === 'other' && item.triggerNote
        ? item.triggerNote
        : t.trigger[item.trigger as RelapseTrigger]
      : null;

    const punishmentText = item.punishmentExecuted
      ? t.history.punishmentDone
      : t.history.punishmentPending;

    const granularity = data.contract?.granularity || 'day';
    const unitLabel = granularity === 'day' ? t.history.days : t.history.blocks;

    return (
      <View style={styles.recordItem}>
        <View style={styles.recordHeader}>
          <Text style={styles.recordDate}>{formatDisplayDateWithYear(item.timestamp)}</Text>
          <Text style={styles.streakInfo}>
            {t.history.streakWas} {item.streakCount} {unitLabel}
          </Text>
        </View>
        {triggerText && (
          <Text style={styles.triggerText}>{triggerText}</Text>
        )}
        <View style={styles.punishmentRow}>
          <View
            style={[
              styles.punishmentBadge,
              item.punishmentExecuted ? styles.punishmentBadgeDone : styles.punishmentBadgePending,
            ]}
          >
            <Text
              style={[
                styles.punishmentBadgeText,
                item.punishmentExecuted ? styles.punishmentBadgeTextDone : styles.punishmentBadgeTextPending,
              ]}
            >
              {punishmentText}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRelapseItem = ({ item }: { item: typeof sortedRelapses[0] }) => {
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

  // Show failures if using contract system
  if (hasContract) {
    const renderHeader = () => (
      <>
        {contractStats && (
          <View style={styles.statsSection}>
            <SuccessRateDisplay
              successRate={contractStats.successRate}
              totalSuccesses={contractStats.totalSuccesses}
              failureCount={contractStats.failureCount}
            />
          </View>
        )}
      </>
    );

    if (sortedFailures.length === 0) {
      return (
        <View style={styles.container}>
          <View style={styles.listContent}>
            {renderHeader()}
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>{t.history.noFailures}</Text>
              <Text style={styles.emptySubtext}>{t.history.keepGoing}</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={sortedFailures}
          renderItem={renderFailureItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
        />
      </View>
    );
  }

  // Legacy mode - show relapses
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
        renderItem={renderRelapseItem}
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
  punishmentRow: {
    marginTop: 12,
    flexDirection: 'row',
  },
  punishmentBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  punishmentBadgeDone: {
    backgroundColor: '#E8F5E9',
  },
  punishmentBadgePending: {
    backgroundColor: '#FFF3E0',
  },
  punishmentBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  punishmentBadgeTextDone: {
    color: '#2E7D32',
  },
  punishmentBadgeTextPending: {
    color: '#E65100',
  },
  statsSection: {
    marginBottom: 24,
  },
  emptySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
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
