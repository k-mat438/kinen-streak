import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useI18n } from '../i18n';

interface Props {
  startTimestamp: number;
  targetTimestamp?: number;
  showRemaining?: boolean;
}

export function TimerDisplay({ startTimestamp, targetTimestamp, showRemaining = false }: Props) {
  const { t } = useI18n();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      let diff: number;

      if (showRemaining && targetTimestamp) {
        diff = Math.max(0, targetTimestamp - now);
        setIsCompleted(diff === 0);
      } else {
        diff = Math.max(0, now - startTimestamp);
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTime({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp, targetTimestamp, showRemaining]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const label = showRemaining
    ? (isCompleted ? t.home.goalReached : t.home.remainingTime)
    : t.home.elapsedTime;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.timerRow}>
        <View style={styles.timeUnit}>
          <Text style={[styles.timeValue, isCompleted && styles.completedText]}>{time.days}</Text>
          <Text style={styles.timeLabel}>{t.home.timerDays}</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={[styles.timeValue, isCompleted && styles.completedText]}>{pad(time.hours)}</Text>
          <Text style={styles.timeLabel}>{t.home.timerHours}</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={[styles.timeValue, isCompleted && styles.completedText]}>{pad(time.minutes)}</Text>
          <Text style={styles.timeLabel}>{t.home.timerMinutes}</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.timeUnit}>
          <Text style={[styles.timeValue, isCompleted && styles.completedText]}>{pad(time.seconds)}</Text>
          <Text style={styles.timeLabel}>{t.home.timerSeconds}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 50,
  },
  timeValue: {
    fontSize: 40,
    fontWeight: '300',
    color: '#1A1A1A',
  },
  completedText: {
    color: '#4CAF50',
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
    marginBottom: 16,
  },
});
