"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "EUR" | "INR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amountUsd: number) => string;
};

const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  INR: 83.5,
  GBP: 0.79,
  JPY: 149,
  AUD: 1.53,
  CAD: 1.36,
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

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rates, setRates] = useState<Record<Currency, number>>(FALLBACK_RATES);

  // Read currency from cookie on mount
  useEffect(() => {
    try {
      if (typeof document === "undefined") return;
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("fabricx_currency="));
      if (match) {
        const value = match.split("=")[1] as Currency;
        if (FALLBACK_RATES[value] != null) {
          setCurrencyState(value);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch live exchange rates
  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        if (!res.ok) return;
        const data = await res.json();
        const r = data.rates;
        setRates({
          USD: 1,
          EUR: r.EUR ?? FALLBACK_RATES.EUR,
          INR: r.INR ?? FALLBACK_RATES.INR,
          GBP: r.GBP ?? FALLBACK_RATES.GBP,
          JPY: r.JPY ?? FALLBACK_RATES.JPY,
          AUD: r.AUD ?? FALLBACK_RATES.AUD,
          CAD: r.CAD ?? FALLBACK_RATES.CAD,
          CHF: r.CHF ?? FALLBACK_RATES.CHF,
        });
      } catch {
        // use fallback rates silently
      }
    }
    fetchRates();
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
    const rate = rates[currency] ?? 1;
    const converted = amountUsd * rate;
    const locale = LOCALES[currency] ?? "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "INR" || currency === "JPY" ? 0 : 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
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