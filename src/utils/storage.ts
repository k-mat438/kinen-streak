import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, DEFAULT_APP_DATA } from '../types';

const STORAGE_KEY = 'kinen_streak_data';

// Load app data from storage
export async function loadAppData(): Promise<AppData> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const data = JSON.parse(json) as AppData;
      // Merge with defaults for any missing fields
      return {
        ...DEFAULT_APP_DATA,
        ...data,
        settings: {
          ...DEFAULT_APP_DATA.settings,
          ...data.settings,
        },
      };
    }
  } catch (error) {
    console.error('Failed to load app data:', error);
  }
  return DEFAULT_APP_DATA;
}

// Save app data to storage
export async function saveAppData(data: AppData): Promise<void> {
  try {
    const json = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Failed to save app data:', error);
    throw error;
  }
}

// Export data as JSON string
export function exportDataAsJson(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

// Reset all data
export async function resetAllData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset data:', error);
    throw error;
  }
}
