"use client";

import { useCartSync } from "@/lib/hooks/useCartSync";

interface CartSyncProviderProps {
  children: React.ReactNode;
}

export function CartSyncProvider({ children }: CartSyncProviderProps) {
  useCartSync();
  return <>{children}</>;
}

