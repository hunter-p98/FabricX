// app/Providers.tsx
"use client";

import { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { CurrencyProvider } from "./CurrencyContext";
import { ProductsProvider } from "./ProductsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <ProductsProvider>{children}</ProductsProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}
