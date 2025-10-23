'use client'; // Ensure this component is treated as a Client Component

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, TranslationKeys, getTranslation } from '../lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Default locale for server rendering and initial client load
const defaultLocale: Locale = 'en';

export function LocaleProvider({ children }: { children: ReactNode }) {
  // 1. Initialize with a default value first
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Initialize 't' based on the default locale initially
  const [t, setT] = useState<TranslationKeys>(() => getTranslation(defaultLocale));

  // 2. Use useEffect to read localStorage ONLY on the client
  useEffect(() => {
    const saved = localStorage.getItem('locale');
    const initialLocale = (saved as Locale) || defaultLocale;
    if (initialLocale !== locale) { // Only update if different from default/current
        setLocaleState(initialLocale);
        setT(getTranslation(initialLocale)); // Update translations if locale changed
    }
  }, []); // Empty dependency array ensures it runs only once on mount


  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale); // This is fine (event handler context)
    setT(getTranslation(newLocale));
  };

  // This useEffect might be redundant now if setLocale always updates 't',
  // but it ensures 't' syncs if 'locale' were somehow changed externally.
  // Keep it unless you're sure setLocale is the ONLY way 'locale' state changes.
  // useEffect(() => {
  //   setT(getTranslation(locale));
  // }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}