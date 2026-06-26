// app/CurrencyContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "EUR" | "INR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountUsd: number) => string;
};

const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.9,
  INR: 90,
  GBP: 0.78,
  JPY: 150,
  AUD: 1.5,
  CAD: 1.35,
  CHF: 0.9,
};

const LOCALES: Record<Currency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  INR: "en-IN",
  GBP: "en-GB",
  JPY: "ja-JP",
  AUD: "en-AU",
  CAD: "en-CA",
  CHF: "de-CH",
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  // Read cookie set by middleware (or user choice) on mount
  useEffect(() => {
    try {
      if (typeof document === "undefined") return;
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("fabricx_currency="));
      if (match) {
        const value = match.split("=")[1] as Currency;
        if (RATES[value] != null) {
          setCurrencyState(value);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      if (typeof document !== "undefined") {
        document.cookie = `fabricx_currency=${c}; path=/; max-age=${
          60 * 60 * 24 * 30
        }`;
      }
    } catch {
      // ignore
    }
  };

  const format = (amountUsd: number): string => {
    const rate = RATES[currency] ?? 1;
    const converted = amountUsd * rate;
    const locale = LOCALES[currency] ?? "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(converted);
  };

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    format,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
