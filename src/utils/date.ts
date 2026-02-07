import { ElapsedTime, Contract } from '../types';

// Format date for display (e.g., "Jan 12")
export function formatDisplayDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format date for display with year (e.g., "Jan 12, 2026")
export function formatDisplayDateWithYear(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Format day boundary time for display (e.g., "4:00 AM")
export function formatBoundaryTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = String(minute).padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

// Calculate elapsed time from a start timestamp
export function calculateElapsedTime(startTimestamp: number): ElapsedTime {
  const now = Date.now();
  const totalSeconds = Math.max(0, Math.floor((now - startTimestamp) / 1000));

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, totalSeconds };
}

// Calculate days from timestamp
export function calculateDaysFromTimestamp(startTimestamp: number): number {
  const now = Date.now();
  const diffMs = now - startTimestamp;
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

// ============================================
// Day Boundary Functions
// ============================================

// Get the start of the "day" based on custom boundary time
// e.g., if boundary is 4:00 AM, the day starts at 4:00 AM
export function getDayBoundaryStart(
  timestamp: number,
  boundaryHour: number,
  boundaryMinute: number
): Date {
  const date = new Date(timestamp);

  // Create a date at the boundary time on the same calendar day
  const boundaryOnSameDay = new Date(date);
  boundaryOnSameDay.setHours(boundaryHour, boundaryMinute, 0, 0);

  // If current time is before the boundary, the "day" started yesterday
  if (date < boundaryOnSameDay) {
    boundaryOnSameDay.setDate(boundaryOnSameDay.getDate() - 1);
  }

  return boundaryOnSameDay;
}

// Get the date string (YYYY-MM-DD) for a given timestamp considering boundary
export function getDayDateString(
  timestamp: number,
  boundaryHour: number,
  boundaryMinute: number
): string {
  const dayStart = getDayBoundaryStart(timestamp, boundaryHour, boundaryMinute);
  return dayStart.toISOString().split('T')[0];
}

// Calculate the number of completed "days" since start, considering boundary
export function calculateDaysSinceBoundary(
  startTimestamp: number,
  boundaryHour: number,
  boundaryMinute: number
): number {
  const now = Date.now();
  const startBoundary = getDayBoundaryStart(startTimestamp, boundaryHour, boundaryMinute);
  const nowBoundary = getDayBoundaryStart(now, boundaryHour, boundaryMinute);

  const diffMs = nowBoundary.getTime() - startBoundary.getTime();
  return Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
}

// Get time until next day boundary
export function getTimeUntilNextBoundary(
  boundaryHour: number,
  boundaryMinute: number
): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const nextBoundary = new Date(now);
  nextBoundary.setHours(boundaryHour, boundaryMinute, 0, 0);

  // If we've passed today's boundary, move to tomorrow
  if (now >= nextBoundary) {
    nextBoundary.setDate(nextBoundary.getDate() + 1);
  }

  const diffMs = nextBoundary.getTime() - now.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

// ============================================
// Block (Hour Mode) Functions
// ============================================

// Calculate current block number since start
export function calculateCurrentBlock(
  startTimestamp: number,
  blockDurationMinutes: number
): number {
  const now = Date.now();
  const diffMs = now - startTimestamp;
  const diffMinutes = diffMs / (60 * 1000);
  return Math.floor(diffMinutes / blockDurationMinutes);
}

// Get time elapsed in current block
export function getBlockProgress(
  startTimestamp: number,
  blockDurationMinutes: number
): { elapsed: number; remaining: number; percent: number } {
  const now = Date.now();
  const diffMs = now - startTimestamp;
  const diffMinutes = diffMs / (60 * 1000);

  const elapsedInBlock = diffMinutes % blockDurationMinutes;
  const remaining = blockDurationMinutes - elapsedInBlock;
  const percent = (elapsedInBlock / blockDurationMinutes) * 100;

  return {
    elapsed: Math.floor(elapsedInBlock),
    remaining: Math.ceil(remaining),
    percent: Math.min(100, percent),
  };
}

// Get the start timestamp of the current block
export function getCurrentBlockStart(
  startTimestamp: number,
  blockDurationMinutes: number
): number {
  const currentBlock = calculateCurrentBlock(startTimestamp, blockDurationMinutes);
  return startTimestamp + currentBlock * blockDurationMinutes * 60 * 1000;
}

// ============================================
// Streak Calculation
// ============================================

// Calculate streak based on contract settings
export function calculateStreak(contract: Contract, failures: { timestamp: number }[]): number {
  if (contract.granularity === 'hour' && contract.blockDurationMinutes) {
    return calculateBlockStreak(contract.startedAt, contract.blockDurationMinutes, failures);
  }
  return calculateDayStreak(
    contract.startedAt,
    contract.dayBoundaryHour,
    contract.dayBoundaryMinute,
    failures
  );
}

// Calculate day-based streak
function calculateDayStreak(
  startTimestamp: number,
  boundaryHour: number,
  boundaryMinute: number,
  failures: { timestamp: number }[]
): number {
  if (failures.length === 0) {
    return calculateDaysSinceBoundary(startTimestamp, boundaryHour, boundaryMinute);
  }

  // Find most recent failure
  const sortedFailures = [...failures].sort((a, b) => b.timestamp - a.timestamp);
  const lastFailure = sortedFailures[0];

  return calculateDaysSinceBoundary(lastFailure.timestamp, boundaryHour, boundaryMinute);
}

// Calculate block-based streak
function calculateBlockStreak(
  startTimestamp: number,
  blockDurationMinutes: number,
  failures: { timestamp: number }[]
): number {
  if (failures.length === 0) {
    return calculateCurrentBlock(startTimestamp, blockDurationMinutes);
  }

  // Find most recent failure
  const sortedFailures = [...failures].sort((a, b) => b.timestamp - a.timestamp);
  const lastFailure = sortedFailures[0];

  return calculateCurrentBlock(lastFailure.timestamp, blockDurationMinutes);
}

// Format block duration for display
export function formatBlockDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}
