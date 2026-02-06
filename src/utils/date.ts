import { Settings } from '../types';

// Get the "logical date" based on day boundary settings
// If it's 3:00 AM and boundary is 4:00 AM, it's still "yesterday"
export function getLogicalDate(settings: Settings, date: Date = new Date()): string {
  const { dayBoundaryHour, dayBoundaryMinute } = settings;

  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();

  // Check if we're before the day boundary
  const isBeforeBoundary =
    currentHour < dayBoundaryHour ||
    (currentHour === dayBoundaryHour && currentMinute < dayBoundaryMinute);

  // If before boundary, use yesterday's date
  const logicalDate = new Date(date);
  if (isBeforeBoundary) {
    logicalDate.setDate(logicalDate.getDate() - 1);
  }

  return formatDate(logicalDate);
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse YYYY-MM-DD string to Date
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Get previous date string
export function getPreviousDate(dateStr: string): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() - 1);
  return formatDate(date);
}

// Format date for display (e.g., "Jan 12")
export function formatDisplayDate(dateStr: string): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format day boundary time for display (e.g., "4:00 AM")
export function formatBoundaryTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = String(minute).padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

// Get all dates from start to today (for streak calculation)
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let current = parseDate(startDate);
  const end = parseDate(endDate);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
