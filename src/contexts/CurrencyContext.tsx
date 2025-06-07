
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const currencyOptions: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

export const exchangeRates: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095
};

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number, fromCurrency?: string) => string;
  convertAmount: (amount: number, fromCurrency: string, toCurrency?: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencyOptions[0]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('smartspend_currency');
    if (savedCurrency) {
      const found = currencyOptions.find(c => c.code === savedCurrency);
      if (found) setCurrentCurrency(found);
    }
  }, []);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('smartspend_currency', currency.code);
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency?: string): number => {
    const targetCurrency = toCurrency || currentCurrency.code;
    if (fromCurrency === targetCurrency) return amount;
    
    // Convert to INR first, then to target currency
    const inrAmount = amount / exchangeRates[fromCurrency];
    return inrAmount * exchangeRates[targetCurrency];
  };

  const formatCurrency = (amount: number, fromCurrency = 'INR'): string => {
    const convertedAmount = convertAmount(amount, fromCurrency);
    return `${currentCurrency.symbol}${convertedAmount.toLocaleString('en-IN', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currentCurrency, 
      setCurrency, 
      formatCurrency, 
      convertAmount 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
