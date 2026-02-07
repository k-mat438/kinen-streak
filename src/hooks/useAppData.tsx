import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AppData,
  DEFAULT_APP_DATA,
  QuitReason,
  RelapseTrigger,
  RecoveryAction,
  Settings,
  Stats,
  Contract,
  ContractStats,
  FailureEvent,
  BehaviorCategory,
  ContractGranularity,
  PunishmentLevel,
  SelfPenaltyTask,
  DonationCategory,
  DEFAULT_SETTINGS,
} from '../types';
import { loadAppData, saveAppData, resetAllData } from '../utils/storage';
import { calculateStats, calculateContractStats } from '../utils/stats';
import { calculateStreak } from '../utils/date';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface CreateContractParams {
  behavior: BehaviorCategory;
  behaviorCustomName?: string;
  granularity: ContractGranularity;
  blockDurationMinutes?: number;
  durationDays?: number;
  punishmentLevel: PunishmentLevel;
  selfPenaltyTask?: SelfPenaltyTask;
  selfPenaltyCustom?: string;
  donationCategory?: DonationCategory;
  donationAmount?: number;
}

interface AppDataContextType {
  data: AppData;
  stats: Stats;
  contractStats: ContractStats | null;
  isLoading: boolean;
  isStarted: boolean;
  hasContract: boolean;

  // Legacy
  startChallenge: (reason: QuitReason, goalDays: number) => Promise<void>;
  recordRelapse: (trigger?: RelapseTrigger, note?: string, recovery?: RecoveryAction) => Promise<void>;

  // New contract system
  createContract: (params: CreateContractParams) => Promise<void>;
  recordFailure: (trigger?: RelapseTrigger, note?: string) => Promise<void>;
  markPunishmentExecuted: (failureId: string, note?: string) => Promise<void>;
  endContract: () => Promise<void>;
  restartSameContract: () => Promise<void>;

  // Settings
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetData: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_APP_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadAppData().then((loaded) => {
      setData(loaded);
      setIsLoading(false);
    });
  }, []);

  // Computed values
  const stats = calculateStats(data);
  const isStarted = data.startTimestamp !== null || data.contract !== null;
  const hasContract = data.contract !== null;

  // Contract stats (only if contract exists)
  const contractStats = data.contract
    ? calculateContractStats(data.contract, data.failures, data.completedUnits)
    : null;

  // ============================================
  // Legacy methods (kept for backward compatibility)
  // ============================================

  const startChallenge = useCallback(async (reason: QuitReason, goalDays: number) => {
    const newData: AppData = {
      ...data,
      startTimestamp: Date.now(),
      quitReason: reason,
      goalDays,
    };

    setData(newData);
    await saveAppData(newData);
  }, [data]);

  const recordRelapse = useCallback(
    async (trigger?: RelapseTrigger, note?: string, recovery?: RecoveryAction) => {
      if (data.startTimestamp === null && data.contract === null) return;

      // If using new contract system, redirect to recordFailure
      if (data.contract) {
        await recordFailureInternal(trigger, note);
        return;
      }

      const currentStreak = stats.currentStreak;

      const newData: AppData = {
        ...data,
        startTimestamp: Date.now(),
        relapses: [
          ...data.relapses,
          {
            timestamp: Date.now(),
            trigger,
            triggerNote: trigger === 'other' ? note : undefined,
            recoveryAction: recovery,
            streakDays: currentStreak,
          },
        ],
      };

      setData(newData);
      await saveAppData(newData);
    },
    [data, stats.currentStreak]
  );

  // ============================================
  // New contract system methods
  // ============================================

  const createContract = useCallback(async (params: CreateContractParams) => {
    const now = Date.now();
    const contractId = generateId();

    const contract: Contract = {
      id: contractId,
      behavior: params.behavior,
      behaviorCustomName: params.behaviorCustomName,
      granularity: params.granularity,
      dayBoundaryHour: data.settings.dayBoundaryHour,
      dayBoundaryMinute: data.settings.dayBoundaryMinute,
      blockDurationMinutes: params.blockDurationMinutes,
      durationDays: params.durationDays,
      punishmentLevel: params.punishmentLevel,
      selfPenaltyTask: params.selfPenaltyTask,
      selfPenaltyCustom: params.selfPenaltyCustom,
      donationCategory: params.donationCategory,
      donationAmount: params.donationAmount,
      createdAt: now,
      startedAt: now,
    };

    const newData: AppData = {
      ...data,
      contract,
      currentBlockStart: params.granularity === 'hour' ? now : null,
      startTimestamp: now,
      failures: [],
      completedUnits: [],
    };

    setData(newData);
    await saveAppData(newData);
  }, [data]);

  const recordFailureInternal = async (trigger?: RelapseTrigger, note?: string) => {
    if (!data.contract) return;

    const currentStreak = calculateStreak(data.contract, data.failures);
    const failureId = generateId();

    const failure: FailureEvent = {
      id: failureId,
      contractId: data.contract.id,
      timestamp: Date.now(),
      trigger,
      triggerNote: trigger === 'other' ? note : undefined,
      streakCount: currentStreak,
      punishmentLevel: data.contract.punishmentLevel,
      punishmentExecuted: false,
    };

    const newData: AppData = {
      ...data,
      failures: [...data.failures, failure],
      currentBlockStart: data.contract.granularity === 'hour' ? Date.now() : null,
    };

    setData(newData);
    await saveAppData(newData);
  };

  const recordFailure = useCallback(
    async (trigger?: RelapseTrigger, note?: string) => {
      await recordFailureInternal(trigger, note);
    },
    [data]
  );

  const markPunishmentExecuted = useCallback(
    async (failureId: string, note?: string) => {
      const updatedFailures = data.failures.map((f) =>
        f.id === failureId
          ? { ...f, punishmentExecuted: true, punishmentNote: note }
          : f
      );

      const newData: AppData = {
        ...data,
        failures: updatedFailures,
      };

      setData(newData);
      await saveAppData(newData);
    },
    [data]
  );

  const endContract = useCallback(async () => {
    const newData: AppData = {
      ...data,
      contract: null,
      currentBlockStart: null,
      startTimestamp: null,
    };

    setData(newData);
    await saveAppData(newData);
  }, [data]);

  const restartSameContract = useCallback(async () => {
    if (!data.contract) return;

    const now = Date.now();
    const newContractId = generateId();

    // Create new contract with same settings
    const newContract: Contract = {
      ...data.contract,
      id: newContractId,
      createdAt: now,
      startedAt: now,
    };

    const newData: AppData = {
      ...data,
      contract: newContract,
      currentBlockStart: data.contract.granularity === 'hour' ? now : null,
      startTimestamp: now,
      failures: [],
      completedUnits: [],
    };

    setData(newData);
    await saveAppData(newData);
  }, [data]);

  // ============================================
  // Settings
  // ============================================

  const updateSettings = useCallback(
    async (newSettings: Partial<Settings>) => {
      const newData: AppData = {
        ...data,
        settings: {
          ...data.settings,
          ...newSettings,
        },
      };

      setData(newData);
      await saveAppData(newData);
    },
    [data]
  );

  const resetDataFn = useCallback(async () => {
    await resetAllData();
    setData(DEFAULT_APP_DATA);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        data,
        stats,
        contractStats,
        isLoading,
        isStarted,
        hasContract,
        startChallenge,
        recordRelapse,
        createContract,
        recordFailure,
        markPunishmentExecuted,
        endContract,
        restartSameContract,
        updateSettings,
        resetData: resetDataFn,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}
