import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en, Translations } from './en';
import { ja } from './ja';

export type Language = 'en' | 'ja';

const LANGUAGE_KEY = 'kinen_streak_language';

const translations: Record<Language, Translations> = {
  en,
  ja,
};

interface I18nContextType {
  language: Language;
  locale: Language; // Alias for language
  t: Translations;
  setLanguage: (lang: Language) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved language on mount
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved === 'en' || saved === 'ja') {
        setLanguageState(saved);
      }
      setIsLoaded(true);
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const t = translations[language];

  // Don't render until language is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ language, locale: language, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  ja: '日本語',
};
