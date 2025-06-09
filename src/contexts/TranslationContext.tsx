import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { languages } from '../i18n';

interface TranslationContextType {
  currentLanguage: { code: string; name: string; flag: string };
  setLanguage: (lang: { code: string; name: string; flag: string }) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useI18nTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const currentLang = i18n.language || 'en';
    return languages.find(l => l.code === currentLang) || languages[0];
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('smartspend_language');
    if (savedLanguage) {
      const language = languages.find(l => l.code === savedLanguage);
      if (language && language.code !== currentLanguage.code) {
        setCurrentLanguage(language);
        i18n.changeLanguage(language.code);
      }
    }
  }, [i18n, currentLanguage.code]);

  const handleLanguageChange = (lang: { code: string; name: string; flag: string }) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang.code);
    localStorage.setItem('smartspend_language', lang.code);
  };

  const value = {
    currentLanguage,
    setLanguage: handleLanguageChange,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export { languages };