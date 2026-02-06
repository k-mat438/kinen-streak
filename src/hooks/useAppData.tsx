import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  AppData,
  DayRecord,
  DEFAULT_APP_DATA,
  RelapseTrigger,
  Settings,
  Stats,
} from '../types';
import { loadAppData, saveAppData, resetAllData } from '../utils/storage';
import { calculateStats, getTodayStatus } from '../utils/stats';
import { getLogicalDate } from '../utils/date';

interface AppDataContextType {
  data: AppData;
  stats: Stats;
  todayRecord: DayRecord | null;
  todayDate: string;
  isLoading: boolean;
  recordSmokeFree: () => Promise<void>;
  recordRelapse: (trigger?: RelapseTrigger, note?: string) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetData: () => Promise<void>;
  refreshData: () => Promise<void>;
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
  const stats = calculateStats(data.records, data.settings);
  const todayRecord = getTodayStatus(data.records, data.settings);
  const todayDate = getLogicalDate(data.settings);

  // Record smoke-free day
  const recordSmokeFree = useCallback(async () => {
    const today = getLogicalDate(data.settings);
    const newRecord: DayRecord = {
      date: today,
      status: 'smoke-free',
      recordedAt: Date.now(),
    };

    const newData: AppData = {
      ...data,
      records: {
        ...data.records,
        [today]: newRecord,
      },
    };

    setData(newData);
    await saveAppData(newData);
  }, [data]);

  // Record relapse
  const recordRelapse = useCallback(
    async (trigger?: RelapseTrigger, note?: string) => {
      const today = getLogicalDate(data.settings);
      const newRecord: DayRecord = {
        date: today,
        status: 'relapse',
        trigger,
        triggerNote: trigger === 'other' ? note : undefined,
        recordedAt: Date.now(),
      };

      const newData: AppData = {
        ...data,
        records: {
          ...data.records,
          [today]: newRecord,
        },
      };

      setData(newData);
      await saveAppData(newData);
    },
    [data]
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

  // Refresh data from storage
  const refreshData = useCallback(async () => {
    const loaded = await loadAppData();
    setData(loaded);
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        data,
        stats,
        todayRecord,
        todayDate,
        isLoading,
        recordSmokeFree,
        recordRelapse,
        updateSettings,
        resetData: resetDataFn,
        refreshData,
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
