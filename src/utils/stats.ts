import { DayRecord, Settings, Stats } from '../types';
import { getLogicalDate, getPreviousDate } from './date';

// Calculate all stats from records
export function calculateStats(
  records: Record<string, DayRecord>,
  settings: Settings
): Stats {
  const today = getLogicalDate(settings);
  const todayRecord = records[today];

  // Count total smoke-free days and relapses
  let totalSmokeFree = 0;
  let relapseCount = 0;

  Object.values(records).forEach((record) => {
    if (record.status === 'smoke-free') {
      totalSmokeFree++;
    } else if (record.status === 'relapse') {
      relapseCount++;
    }
  });

  // Calculate current streak (consecutive smoke-free days ending today)
  let currentStreak = 0;
  if (todayRecord?.status === 'smoke-free') {
    currentStreak = 1;
    let checkDate = getPreviousDate(today);
    while (records[checkDate]?.status === 'smoke-free') {
      currentStreak++;
      checkDate = getPreviousDate(checkDate);
    }
  }

  // Calculate best streak (longest consecutive smoke-free sequence)
  const bestStreak = calculateBestStreak(records);

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    totalSmokeFree,
    relapseCount,
  };
}

// Find the longest streak in history
function calculateBestStreak(records: Record<string, DayRecord>): number {
  const sortedDates = Object.keys(records).sort();
  if (sortedDates.length === 0) return 0;

  let bestStreak = 0;
  let currentStreak = 0;

  for (const date of sortedDates) {
    const record = records[date];
    if (record.status === 'smoke-free') {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

// Get today's status
export function getTodayStatus(
  records: Record<string, DayRecord>,
  settings: Settings
): DayRecord | null {
  const today = getLogicalDate(settings);
  return records[today] || null;
}
