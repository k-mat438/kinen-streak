import { ElapsedTime } from '../types';

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
