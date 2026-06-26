// app/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  id: string;
  variant_id: number;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

type CartContextValue = {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue>({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  updateQuantity: () => {},
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
});

const CART_STORAGE_KEY = "fabricx_cart_v1";
const WISHLIST_STORAGE_KEY = "fabricx_wishlist_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const storedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (e) {
      console.error("Failed to load cart/wishlist from storage", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to storage", e);
    }
  }, [wishlist]);

  const addItem: CartContextValue["addItem"] = (item) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.id === item.id &&
          ci.size === item.size &&
          ci.color === item.color
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (item.quantity ?? 1),
        };
        return updated;
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isInWishlist = (id: string) => wishlist.includes(id);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clearCart,
        updateQuantity,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}