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

// Storage utilities with error handling
const STORAGE_KEY = 'smartspend_currency';

const saveCurrencyToStorage = (currency: Currency) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, currency.code);
    }
  } catch (error) {
    console.error('Failed to save currency preference:', error);
  }
};

const loadCurrencyFromStorage = (): Currency => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCurrency = localStorage.getItem(STORAGE_KEY);
      if (savedCurrency) {
        const found = currencyOptions.find(c => c.code === savedCurrency);
        if (found) {
          return found;
        }
      }
    }
  } catch (error) {
    console.error('Failed to load currency preference:', error);
  }
  return currencyOptions[0]; // Default to INR
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => 
    loadCurrencyFromStorage()
  );

  // Enhanced currency setting with validation
  const setCurrency = (currency: Currency) => {
    // Validate currency object
    if (!currency || !currency.code || !currency.symbol || !currency.name) {
      console.error('Invalid currency object:', currency);
      return;
    }

    // Validate currency is in our supported list
    const isSupported = currencyOptions.some(c => c.code === currency.code);
    if (!isSupported) {
      console.error('Unsupported currency:', currency.code);
      return;
    }

    setCurrentCurrency(currency);
    saveCurrencyToStorage(currency);
  };

  // Enhanced amount conversion with error handling
  const convertAmount = (amount: number, fromCurrency: string, toCurrency?: string): number => {
    try {
      // Input validation
      if (typeof amount !== 'number' || isNaN(amount)) {
        console.error('Invalid amount for conversion:', amount);
        return 0;
      }

      if (!fromCurrency || typeof fromCurrency !== 'string') {
        console.error('Invalid fromCurrency:', fromCurrency);
        return amount;
      }

      const targetCurrency = toCurrency || currentCurrency.code;
      
      // Same currency, no conversion needed
      if (fromCurrency === targetCurrency) {
        return amount;
      }
      
      // Check if currencies are supported
      if (!exchangeRates[fromCurrency]) {
        console.error('Unsupported source currency:', fromCurrency);
        return amount;
      }

      if (!exchangeRates[targetCurrency]) {
        console.error('Unsupported target currency:', targetCurrency);
        return amount;
      }
      
      // Convert to INR first, then to target currency
      const inrAmount = amount / exchangeRates[fromCurrency];
      const convertedAmount = inrAmount * exchangeRates[targetCurrency];
      
      // Round to 2 decimal places
      return Math.round(convertedAmount * 100) / 100;
    } catch (error) {
      console.error('Currency conversion error:', error);
      return amount; // Return original amount on error
    }
  };

  // Enhanced currency formatting with better error handling
  const formatCurrency = (amount: number, fromCurrency = 'INR'): string => {
    try {
      // Input validation
      if (typeof amount !== 'number' || isNaN(amount)) {
        console.error('Invalid amount for formatting:', amount);
        return `${currentCurrency.symbol}0`;
      }

      const convertedAmount = convertAmount(amount, fromCurrency);
      
      // Format with proper locale and options
      const formattedNumber = convertedAmount.toLocaleString('en-IN', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2,
        useGrouping: true
      });
      
      return `${currentCurrency.symbol}${formattedNumber}`;
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `${currentCurrency.symbol}${amount}`;
    }
  };

  // Load currency preference on mount with proper error handling
  useEffect(() => {
    try {
      const savedCurrency = loadCurrencyFromStorage();
      if (savedCurrency.code !== currentCurrency.code) {
        setCurrentCurrency(savedCurrency);
      }
    } catch (error) {
      console.error('Error loading currency preference:', error);
    }
  }, []);

  // Validate current currency on mount
  useEffect(() => {
    const isCurrentCurrencyValid = currencyOptions.some(c => c.code === currentCurrency.code);
    if (!isCurrentCurrencyValid) {
      console.warn('Current currency is invalid, resetting to default:', currentCurrency);
      setCurrentCurrency(currencyOptions[0]);
    }
  }, [currentCurrency]);

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