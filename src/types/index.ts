// Daily status for a given day
export type DailyStatus = 'smoke-free' | 'relapse' | 'unknown';

// Relapse trigger options
export type RelapseTrigger =
  | 'stress'
  | 'social'
  | 'habit'
  | 'urge'
  | 'work'
  | 'boredom'
  | 'other';

// A single day's record
export interface DayRecord {
  date: string; // YYYY-MM-DD format (based on user's day boundary)
  status: DailyStatus;
  trigger?: RelapseTrigger;
  triggerNote?: string; // For "other" trigger
  recordedAt: number; // timestamp
}

// User settings
export interface Settings {
  dayBoundaryHour: number; // 0-23, hour when day resets
  dayBoundaryMinute: number; // 0 or 30
  startDate?: string; // YYYY-MM-DD, optional challenge start date
}

// App state stored in AsyncStorage
export interface AppData {
  settings: Settings;
  records: Record<string, DayRecord>; // keyed by date string
}

// Computed stats for display
export interface Stats {
  currentStreak: number;
  bestStreak: number;
  totalSmokeFree: number;
  relapseCount: number;
}

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  dayBoundaryHour: 4,
  dayBoundaryMinute: 0,
};

// Default app data
export const DEFAULT_APP_DATA: AppData = {
  settings: DEFAULT_SETTINGS,
  records: {},
};
