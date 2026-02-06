import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AppData,
  DEFAULT_APP_DATA,
  QuitReason,
  RelapseTrigger,
  RecoveryAction,
  Settings,
  Stats,
} from '../types';
import { loadAppData, saveAppData, resetAllData } from '../utils/storage';
import { calculateStats } from '../utils/stats';

interface AppDataContextType {
  data: AppData;
  stats: Stats;
  isLoading: boolean;
  isStarted: boolean;
  startChallenge: (reason: QuitReason, goalDays: number) => Promise<void>;
  recordRelapse: (trigger?: RelapseTrigger, note?: string, recovery?: RecoveryAction) => Promise<void>;
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
  const isStarted = data.startTimestamp !== null;

  // Start the challenge (first time or after reset)
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

  // Record relapse - resets the timer
  const recordRelapse = useCallback(
    async (trigger?: RelapseTrigger, note?: string, recovery?: RecoveryAction) => {
      if (data.startTimestamp === null) return;

      const currentStreak = stats.currentStreak;

      const newData: AppData = {
        ...data,
        startTimestamp: Date.now(), // Reset timer to now
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

  // Update settings
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

  // Reset all data
  const resetDataFn = useCallback(async () => {
    await resetAllData();
    setData(DEFAULT_APP_DATA);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        data,
        stats,
        isLoading,
        isStarted,
        startChallenge,
        recordRelapse,
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
