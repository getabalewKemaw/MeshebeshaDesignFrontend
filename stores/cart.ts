"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartItemInput, CartTotals } from "@/types/cart";

type CartState = CartTotals & {
  items: CartItem[];
  ownerId: string | null;
  hasHydrated: boolean;
  addItem: (payload: CartItemInput, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  replaceItems: (items: CartItem[]) => void;
  setOwner: (ownerId: string | null) => void;
};

export const buildCartKey = (params: {
  productId: string;
  variantId?: string | null;
  size?: string | null;
  color?: string | null;
}) => {
  const variant = params.variantId ?? "base";
  const size = params.size ?? "nosize";
  const color = params.color ?? "nocolor";
  return `${params.productId}:${variant}:${size}:${color}`;
};

const createCartKey = (item: CartItemInput) => buildCartKey(item);

const clampQuantity = (quantity: number, stock?: number | null) => {
  const safeQuantity = Math.max(1, quantity);
  if (typeof stock === "number" && stock >= 0) {
    return Math.min(safeQuantity, stock);
  }
  return safeQuantity;
};

const calculateTotals = (items: CartItem[]): CartTotals => {
  return items.reduce<CartTotals>(
    (totals, item) => {
      totals.itemCount += item.quantity;
      totals.subtotal += item.unitPrice * item.quantity;
      return totals;
    },
    { itemCount: 0, subtotal: 0 }
  );
};

const storage =
  typeof window !== "undefined"
    ? createJSONStorage<CartState>(() => localStorage)
    : undefined;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,
      ownerId: null,
      hasHydrated: false,
      addItem: (payload, quantity = 1) => {
        const key = createCartKey(payload);
        set((state) => {
          const existing = state.items.find((item) => item.key === key);
          let nextItems: CartItem[];

          if (existing) {
            const nextQuantity = clampQuantity(
              existing.quantity + quantity,
              existing.stock
            );
            nextItems = state.items.map((item) =>
              item.key === key ? { ...item, quantity: nextQuantity } : item
            );
          } else {
            const nextQuantity = clampQuantity(quantity, payload.stock);
            const newItem: CartItem = {
              ...payload,
              key,
              quantity: nextQuantity,
              addedAt: Date.now(),
            };
            nextItems = [...state.items, newItem];
          }

          const totals = calculateTotals(nextItems);
          return { items: nextItems, ...totals };
        });
      },
      updateQuantity: (key, quantity) => {
        set((state) => {
          let changed = false;
          const nextItems = state.items.map((item) => {
            if (item.key !== key) return item;
            const nextQuantity = clampQuantity(quantity, item.stock);
            changed = changed || nextQuantity !== item.quantity;
            return { ...item, quantity: nextQuantity };
          });

          if (!changed) return state;
          const totals = calculateTotals(nextItems);
          return { items: nextItems, ...totals };
        });
      },
      removeItem: (key) => {
        set((state) => {
          const nextItems = state.items.filter((item) => item.key !== key);
          const totals = calculateTotals(nextItems);
          return { items: nextItems, ...totals };
        });
      },
      replaceItems: (items) => {
        const totals = calculateTotals(items);
        set({
          items,
          itemCount: totals.itemCount,
          subtotal: totals.subtotal,
        });
      },
      setOwner: (ownerId) => set({ ownerId }),
      clearCart: () => set({ items: [], itemCount: 0, subtotal: 0 }),
    }),
    {
      name: "meshebesha-cart",
      storage,
      onRehydrateStorage: () => (state) => {
        if (state) {
          const totals = calculateTotals(state.items);
          state.itemCount = totals.itemCount;
          state.subtotal = totals.subtotal;
          state.hasHydrated = true;
          state.ownerId = state.ownerId ?? null;
        }
      },
    }
  )
);

