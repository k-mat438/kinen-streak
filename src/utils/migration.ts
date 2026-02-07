import {
  AppData,
  DEFAULT_APP_DATA,
  DEFAULT_SETTINGS,
  Contract,
  FailureEvent,
  RelapseEvent,
} from '../types';

interface LegacyAppData {
  startTimestamp: number | null;
  quitReason?: string;
  goalDays: number;
  relapses: RelapseEvent[];
  settings?: {
    dayBoundaryHour: number;
    dayBoundaryMinute: number;
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function migrateAppData(raw: unknown): AppData {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_APP_DATA;
  }

  const data = raw as Record<string, unknown>;

  // Check if already migrated (has contract field)
  if ('contract' in data) {
    // Already new format, just ensure all fields exist
    return {
      contract: (data.contract as Contract) || null,
      currentBlockStart: (data.currentBlockStart as number) || null,
      failures: (data.failures as FailureEvent[]) || [],
      completedUnits: data.completedUnits as AppData['completedUnits'] || [],
      startTimestamp: (data.startTimestamp as number) || null,
      quitReason: data.quitReason as AppData['quitReason'],
      goalDays: (data.goalDays as number) || DEFAULT_APP_DATA.goalDays,
      relapses: (data.relapses as RelapseEvent[]) || [],
      settings: {
        ...DEFAULT_SETTINGS,
        ...(data.settings as AppData['settings']),
      },
    };
  }

  // Legacy format - migrate
  const legacy = data as unknown as LegacyAppData;

  // If there's an active challenge, convert to contract
  let contract: Contract | null = null;
  let failures: FailureEvent[] = [];

  if (legacy.startTimestamp !== null) {
    const contractId = generateId();

    // Create a contract from legacy data
    contract = {
      id: contractId,
      behavior: 'quit_smoking', // Default for legacy data
      granularity: 'day',
      dayBoundaryHour: legacy.settings?.dayBoundaryHour ?? DEFAULT_SETTINGS.dayBoundaryHour,
      dayBoundaryMinute: legacy.settings?.dayBoundaryMinute ?? DEFAULT_SETTINGS.dayBoundaryMinute,
      punishmentLevel: 'light', // Default
      createdAt: legacy.startTimestamp,
      startedAt: legacy.startTimestamp,
      durationDays: legacy.goalDays,
    };

    // Convert relapses to failures
    failures = legacy.relapses.map((relapse, index) => ({
      id: `migrated-${index}-${relapse.timestamp}`,
      contractId,
      timestamp: relapse.timestamp,
      trigger: relapse.trigger,
      triggerNote: relapse.triggerNote,
      streakCount: relapse.streakDays,
      punishmentLevel: 'light' as const,
      punishmentExecuted: true, // Assume legacy relapses were "handled"
    }));
  }

  return {
    contract,
    currentBlockStart: null,
    failures,
    completedUnits: [],
    startTimestamp: legacy.startTimestamp,
    quitReason: legacy.quitReason as AppData['quitReason'],
    goalDays: legacy.goalDays || DEFAULT_APP_DATA.goalDays,
    relapses: legacy.relapses || [],
    settings: {
      ...DEFAULT_SETTINGS,
      ...legacy.settings,
    },
  };
}
