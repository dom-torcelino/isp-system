import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, TranslationKeys, getTranslation } from '../lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Load from localStorage or default to English
    const saved = localStorage.getItem('locale');
    return (saved as Locale) || 'en';
  });

  const [t, setT] = useState<TranslationKeys>(() => getTranslation(locale));

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    setT(getTranslation(newLocale));
  };

  useEffect(() => {
    setT(getTranslation(locale));
  }, [locale]);

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
