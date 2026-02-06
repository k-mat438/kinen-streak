// Quit reason options (why you want to quit)
export type QuitReason =
  | 'health'
  | 'money'
  | 'family'
  | 'smell'
  | 'freedom'
  | 'fitness'
  | 'other';

// Recovery action options (what to do after relapse)
export type RecoveryAction =
  | 'water'
  | 'walk'
  | 'breathe'
  | 'call'
  | 'chew'
  | 'other';

// Relapse trigger options
export type RelapseTrigger =
  | 'stress'
  | 'social'
  | 'habit'
  | 'urge'
  | 'work'
  | 'boredom'
  | 'other';

// A relapse event
export interface RelapseEvent {
  timestamp: number; // When relapse was recorded
  trigger?: RelapseTrigger;
  triggerNote?: string; // For "other" trigger
  recoveryAction?: RecoveryAction; // What they'll do next
  streakDays: number; // How many days the streak was before this relapse
}

// Default goal days
export const DEFAULT_GOAL_DAYS = 30;

// User settings
export interface Settings {
  dayBoundaryHour: number; // 0-23, hour when day resets
  dayBoundaryMinute: number; // 0 or 30
}

// App state stored in AsyncStorage
export interface AppData {
  startTimestamp: number | null; // When current streak started (null = not started)
  quitReason?: QuitReason; // Why user wants to quit
  goalDays: number; // Target days to reach
  relapses: RelapseEvent[]; // History of relapses
  settings: Settings;
}

// Computed stats for display
export interface Stats {
  currentStreak: number; // Days since start or last relapse
  bestStreak: number; // Longest streak ever
  totalCleanDays: number; // Sum of all streak days
  relapseCount: number; // Number of relapses
}

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  dayBoundaryHour: 4,
  dayBoundaryMinute: 0,
};

// Default app data
export const DEFAULT_APP_DATA: AppData = {
  startTimestamp: null,
  goalDays: DEFAULT_GOAL_DAYS,
  relapses: [],
  settings: DEFAULT_SETTINGS,
};

// Elapsed time for timer display
export interface ElapsedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}
