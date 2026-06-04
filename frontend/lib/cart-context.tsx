'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

// ── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  slug: string;
  size: string;
  color: string;
  colorHex: string;
  quantity: number;
  price_pkr: number;
}

interface Cart {
  _id: string;
  sessionId: string;
  items: CartItem[];
}

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  subtotal: number;
  loading: boolean;
  sessionId: string;
  addItem: (params: {
    productId: string;
    size: string;
    color?: string;
    colorHex?: string;
    quantity?: number;
  }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

const COOKIE_KEY = 'gulf_edit_session';

// ── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>('');
  const [cart, setCart]           = useState<Cart | null>(null);
  const [loading, setLoading]     = useState(true);

  // Initialise sessionId from cookie (or create a new one)
  useEffect(() => {
    let sid = Cookies.get(COOKIE_KEY);
    if (!sid) {
      sid = uuidv4();
      Cookies.set(COOKIE_KEY, sid, { expires: 30, sameSite: 'lax' });
    }
    setSessionId(sid);
  }, []);

  // Fetch cart whenever sessionId changes
  const refreshCart = useCallback(async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      const res  = await fetch(`/api/cart/${sessionId}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) refreshCart();
  }, [sessionId, refreshCart]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const subtotal  = cart?.items.reduce((sum, i) => sum + i.price_pkr * i.quantity, 0) ?? 0;

  // ── Actions ────────────────────────────────────────────────────────────────
  const addItem = async (params: {
    productId: string;
    size: string;
    color?: string;
    colorHex?: string;
    quantity?: number;
  }) => {
    if (!sessionId) return;
    const res = await fetch(`/api/cart/${sessionId}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    setCart(data.data);
  };

  const updateItem = async (itemId: string, quantity: number) => {
    if (!sessionId) return;
    const res = await fetch(`/api/cart/${sessionId}/${itemId}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    setCart(data.data);
  };

  const removeItem = async (itemId: string) => {
    if (!sessionId) return;
    const res = await fetch(`/api/cart/${sessionId}/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    setCart(data.data);
  };

  return (
    <CartContext.Provider
      value={{ cart, itemCount, subtotal, loading, sessionId, addItem, updateItem, removeItem, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
