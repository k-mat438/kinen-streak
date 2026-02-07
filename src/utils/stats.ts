import { AppData, Stats, ContractStats, Contract, FailureEvent, CompletedUnit } from '../types';
import { calculateDaysFromTimestamp, calculateStreak, calculateDaysSinceBoundary, calculateCurrentBlock } from './date';

// Calculate legacy stats from app data (for backward compatibility)
export function calculateStats(data: AppData): Stats {
  const { startTimestamp, relapses, contract, failures } = data;

  // If using new contract system
  if (contract) {
    const currentStreak = calculateStreak(contract, failures);
    const pastStreaks = failures.map((f) => f.streakCount);
    const bestStreak = Math.max(currentStreak, ...pastStreaks, 0);
    const totalCleanDays = currentStreak + pastStreaks.reduce((sum, days) => sum + days, 0);

    return {
      currentStreak,
      bestStreak,
      totalCleanDays,
      relapseCount: failures.length,
    };
  }

  // Legacy mode: If not started yet
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

// Calculate contract-specific statistics
export function calculateContractStats(
  contract: Contract,
  failures: FailureEvent[],
  completedUnits: CompletedUnit[]
): ContractStats {
  // Filter to only this contract's data
  const contractFailures = failures.filter((f) => f.contractId === contract.id);
  const contractUnits = completedUnits.filter((u) => u.contractId === contract.id);

  // Current streak
  const currentStreak = calculateStreak(contract, contractFailures);

  // Total attempts = completed units + failures + current ongoing unit (1)
  // We count completed successful units + 1 for the current period
  const totalSuccesses = contractUnits.length;
  const failureCount = contractFailures.length;

  // Total attempts: all the periods that have passed
  // For day mode: days since start
  // For hour mode: blocks since start
  let totalAttempts: number;
  if (contract.granularity === 'hour' && contract.blockDurationMinutes) {
    totalAttempts = calculateCurrentBlock(contract.startedAt, contract.blockDurationMinutes);
  } else {
    totalAttempts = calculateDaysSinceBoundary(
      contract.startedAt,
      contract.dayBoundaryHour,
      contract.dayBoundaryMinute
    );
  }
  // At minimum, we have 1 attempt (the current period)
  totalAttempts = Math.max(1, totalAttempts);

  // Success rate: (totalAttempts - failures) / totalAttempts
  // This gives us the % of periods without failure
  const successfulPeriods = totalAttempts - failureCount;
  const successRate = totalAttempts > 0
    ? Math.round((successfulPeriods / totalAttempts) * 100)
    : 100;

  // Longest streak: check all past streaks from failures + current streak
  const pastStreaks = contractFailures.map((f) => f.streakCount);
  const longestStreak = Math.max(currentStreak, ...pastStreaks, 0);

  return {
    currentStreak,
    successRate: Math.max(0, Math.min(100, successRate)),
    totalSuccesses: successfulPeriods,
    totalAttempts,
    failureCount,
    longestStreak,
  };
}
