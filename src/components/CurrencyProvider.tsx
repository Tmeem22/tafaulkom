"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'SAR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('SAR');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('smm_currency') as Currency;
    if (saved && (saved === 'SAR' || saved === 'USD')) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('smm_currency', c);
  };

  const formatPrice = (sarPrice: number) => {
    if (!mounted) return `${sarPrice.toFixed(2)} ر.س`; // Default SSR is SAR
    
    if (currency === 'SAR') {
      return `${sarPrice.toFixed(2)} ر.س`;
    }
    
    // Convert SAR to USD (SAR / 3.75)
    return `$${(sarPrice / 3.75).toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
