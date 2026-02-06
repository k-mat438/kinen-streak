import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ElapsedTime } from '../types';
import { calculateElapsedTime } from '../utils/date';
import { useI18n } from '../i18n';

interface Props {
  startTimestamp: number | null;
}

export function ElapsedTimer({ startTimestamp }: Props) {
  const { t } = useI18n();
  const [elapsed, setElapsed] = useState<ElapsedTime | null>(null);

  useEffect(() => {
    if (startTimestamp === null) {
      setElapsed(null);
      return;
    }

    // Calculate immediately
    setElapsed(calculateElapsedTime(startTimestamp));

    // Update every second
    const interval = setInterval(() => {
      setElapsed(calculateElapsedTime(startTimestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp]);

  if (!elapsed || startTimestamp === null) {
    return null;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <View style={styles.container}>
      {/* Days - large display */}
      <View style={styles.daysContainer}>
        <Text style={styles.daysValue}>{elapsed.days}</Text>
        <Text style={styles.daysLabel}>{t.home.days}</Text>
      </View>

      {/* Time - smaller display */}
      <View style={styles.timerRow}>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{pad(elapsed.hours)}</Text>
          <Text style={styles.timeLabel}>{t.home.timerHours}</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{pad(elapsed.minutes)}</Text>
          <Text style={styles.timeLabel}>{t.home.timerMinutes}</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={styles.timeValue}>{pad(elapsed.seconds)}</Text>
          <Text style={styles.timeLabel}>{t.home.timerSeconds}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  daysContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  daysValue: {
    fontSize: 140,
    fontWeight: '200',
    color: '#1A1A1A',
    lineHeight: 150,
  },
  daysLabel: {
    fontSize: 20,
    color: '#666',
    marginTop: 8,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 50,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1A1A1A',
    fontVariant: ['tabular-nums'],
  },
  timeLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  separator: {
    fontSize: 32,
    fontWeight: '300',
    color: '#CCC',
    marginHorizontal: 4,
  },
});
