
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
];

export const translations = {
  en: {
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    budgets: 'Budgets',
    reports: 'Reports',
    notifications: 'Notifications',
    profile: 'Profile',
    addExpense: 'Add Expense',
    setBudget: 'Set Budget',
    monthlyBudget: 'Monthly Budget',
    recentTransactions: 'Recent Transactions',
    aiInsights: 'AI Insights',
    quickActions: 'Quick Actions',
    totalExpenses: 'Total Expenses',
    remaining: 'Remaining',
    spent: 'Spent',
    budget: 'Budget',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    amount: 'Amount',
    category: 'Category',
    description: 'Description',
    date: 'Date',
    paymentMethod: 'Payment Method',
    welcome: 'Welcome',
    namaste: 'Namaste'
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    expenses: 'खर्च',
    budgets: 'बजट',
    reports: 'रिपोर्ट',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    addExpense: 'खर्च जोड़ें',
    setBudget: 'बजट सेट करें',
    monthlyBudget: 'मासिक बजट',
    recentTransactions: 'हाल के लेनदेन',
    aiInsights: 'एआई इनसाइट्स',
    quickActions: 'त्वरित कार्य',
    totalExpenses: 'कुल खर्च',
    remaining: 'शेष',
    spent: 'खर्च किया गया',
    budget: 'बजट',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    amount: 'राशि',
    category: 'श्रेणी',
    description: 'विवरण',
    date: 'तारीख',
    paymentMethod: 'भुगतान विधि',
    welcome: 'स्वागत है',
    namaste: 'नमस्ते'
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్',
    expenses: 'ఖర్చులు',
    budgets: 'బడ్జెట్‌లు',
    reports: 'రిపోర్ట్‌లు',
    notifications: 'నోటిఫికేషన్‌లు',
    profile: 'ప్రొఫైల్',
    addExpense: 'ఖర్చు జోడించు',
    setBudget: 'బడ్జెట్ సెట్ చేయి',
    monthlyBudget: 'నెలవారీ బడ్జెట్',
    recentTransactions: 'ఇటీవలి లావాదేవీలు',
    aiInsights: 'AI ఇన్సైట్స్',
    quickActions: 'త్వరిత చర్యలు',
    totalExpenses: 'మొత్తం ఖర్చులు',
    remaining: 'మిగిలినవి',
    spent: 'ఖర్చు చేసినవి',
    budget: 'బడ్జెట్',
    save: 'సేవ్ చేయి',
    cancel: 'రద్దు చేయి',
    delete: 'తొలగించు',
    edit: 'సవరించు',
    amount: 'మొత్తం',
    category: 'వర్గం',
    description: 'వివరణ',
    date: 'తేదీ',
    paymentMethod: 'చెల్లింపు పద్ధతి',
    welcome: 'స్వాగతం',
    namaste: 'నమస్తే'
  }
};

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('smartspend_language');
    if (savedLanguage) {
      const found = languages.find(l => l.code === savedLanguage);
      if (found) setCurrentLanguage(found);
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('smartspend_language', language.code);
  };

  const t = (key: string): string => {
    const translation = translations[currentLanguage.code as keyof typeof translations];
    return translation[key as keyof typeof translation] || key;
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};
