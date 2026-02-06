import { AppData, Stats } from '../types';
import { calculateDaysFromTimestamp } from './date';

// Calculate all stats from app data
export function calculateStats(data: AppData): Stats {
  const { startTimestamp, relapses } = data;

  // If not started yet
  if (startTimestamp === null) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      totalCleanDays: 0,
      relapseCount: 0,
    };
  }

  // Current streak = days since start timestamp
  const currentStreak = calculateDaysFromTimestamp(startTimestamp);

  // Best streak = max of current streak and all past streaks
  const pastStreaks = relapses.map((r) => r.streakDays);
  const bestStreak = Math.max(currentStreak, ...pastStreaks, 0);

  // Total clean days = current streak + sum of all past streaks
  const totalCleanDays = currentStreak + pastStreaks.reduce((sum, days) => sum + days, 0);

  // Relapse count
  const relapseCount = relapses.length;

  return {
    currentStreak,
    bestStreak,
    totalCleanDays,
    relapseCount,
  };
}
