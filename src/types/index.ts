// ============================================
// Contract Types (Self-Binding System)
// ============================================

// Contract granularity
export type ContractGranularity = 'day' | 'hour';

// Punishment level
export type PunishmentLevel = 'light' | 'medium' | 'strong';

// Target behavior categories
export type BehaviorCategory =
  | 'quit_smoking'
  | 'quit_sns'
  | 'quit_alcohol'
  | 'study'
  | 'exercise'
  | 'custom';

// Self-penalty tasks (Level 1 - light)
export type SelfPenaltyTask =
  | 'exercise'
  | 'cleaning'
  | 'diary'
  | 'meditation'
  | 'pushups'
  | 'custom';

// Donation categories (Level 2 - medium)
export type DonationCategory =
  | 'animal'
  | 'education'
  | 'environment'
  | 'health'
  | 'disaster';

// Contract definition
export interface Contract {
  id: string;
  behavior: BehaviorCategory;
  behaviorCustomName?: string;
  granularity: ContractGranularity;
  dayBoundaryHour: number;
  dayBoundaryMinute: number;
  blockDurationMinutes?: number; // For hour mode
  durationDays?: number;
  punishmentLevel: PunishmentLevel;
  selfPenaltyTask?: SelfPenaltyTask;
  selfPenaltyCustom?: string;
  donationCategory?: DonationCategory;
  donationAmount?: number;
  createdAt: number;
  startedAt: number;
}

// Failure event
export interface FailureEvent {
  id: string;
  contractId: string;
  timestamp: number;
  trigger?: RelapseTrigger;
  triggerNote?: string;
  streakCount: number;
  punishmentLevel: PunishmentLevel;
  punishmentExecuted: boolean;
  punishmentNote?: string;
}

// Completed unit (for success rate calculation)
export interface CompletedUnit {
  contractId: string;
  timestamp: number;
  type: 'day' | 'block';
  dayDate?: string; // YYYY-MM-DD for day type
}

// Contract statistics
export interface ContractStats {
  currentStreak: number;
  successRate: number; // 0-100
  totalSuccesses: number;
  totalAttempts: number;
  failureCount: number;
  longestStreak: number;
}

// ============================================
// Legacy Types (for backward compatibility)
// ============================================

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

// A relapse event (legacy)
export interface RelapseEvent {
  timestamp: number;
  trigger?: RelapseTrigger;
  triggerNote?: string;
  recoveryAction?: RecoveryAction;
  streakDays: number;
}

// Default goal days
export const DEFAULT_GOAL_DAYS = 30;

// User settings
export interface Settings {
  dayBoundaryHour: number; // 0-23, hour when day resets
  dayBoundaryMinute: number; // 0 or 30
  vibrationEnabled: boolean; // Enable vibration on failure
  soundEnabled: boolean; // Enable sound on goal completion
  notificationsEnabled: boolean; // Enable push notifications
}

// App state stored in AsyncStorage
export interface AppData {
  // New contract system
  contract: Contract | null;
  currentBlockStart: number | null;
  failures: FailureEvent[];
  completedUnits: CompletedUnit[];

  // Legacy fields (for backward compatibility and migration)
  startTimestamp: number | null;
  quitReason?: QuitReason;
  goalDays: number;
  relapses: RelapseEvent[];
  settings: Settings;
}

// Computed stats for display (legacy)
export interface Stats {
  currentStreak: number;
  bestStreak: number;
  totalCleanDays: number;
  relapseCount: number;
}

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  dayBoundaryHour: 4,
  dayBoundaryMinute: 0,
  vibrationEnabled: false,
  soundEnabled: true,
  notificationsEnabled: true,
};

// Default app data
export const DEFAULT_APP_DATA: AppData = {
  // New contract system
  contract: null,
  currentBlockStart: null,
  failures: [],
  completedUnits: [],

  // Legacy
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

// Block duration presets (in minutes)
export const BLOCK_DURATION_PRESETS = [25, 60, 180] as const;

// Default donation amounts (in yen)
export const DONATION_AMOUNT_PRESETS = [100, 500, 1000, 3000] as const;
