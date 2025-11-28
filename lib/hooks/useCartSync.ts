"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCartStore, buildCartKey } from "@/stores/cart";
import type { CartItem, CartSyncItem, ServerCartItem } from "@/types/cart";
import { fetchCart, syncCart } from "@/lib/api/cart";


// map from the backends format for displaying them consistently in the frotnend
const mapServerItemsToCartItems = (items: ServerCartItem[]): CartItem[] => {
  return items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    title: item.title,
    subtitle: item.subtitle,
    color: item.color,
    size: item.size,
    image: item.image ?? undefined,
    currency: item.currency,
    unitPrice: item.unitPrice,
    stock: item.stock ?? undefined,
    key: buildCartKey({
      productId: item.productId,
      variantId: item.variantId,
      size: item.size,
      color: item.color,
    }),
    quantity: item.quantity,
    addedAt: Date.now(),
  }));
};



// send to  backend format

const buildSyncPayload = (items: CartItem[]): CartSyncItem[] =>
  items
    .filter((item) => !!item.variantId)
    .map((item) => ({
      variantId: item.variantId as string,
      quantity: item.quantity,
    }));



export const useCartSync = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, hasHydrated, replaceItems, ownerId, setOwner } = useCartStore((state) => ({
    items: state.items,
    hasHydrated: state.hasHydrated,
    replaceItems: state.replaceItems,
    ownerId: state.ownerId,
    setOwner: state.setOwner,
  }));



  // refs to avoid race conditions.

  const [initialSyncDone, setInitialSyncDone] = useState(false);
  const syncingRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetOwnerId = isAuthenticated && user?.id ? user.id : null;



  // three  things handle in these effec
  //  user login for the first times -< fetch the server cart and  overwrites the local cart and set owner
  //use logeed in ,so  syncs b.n the server and the local cart
  
  useEffect(() => {
    if (!hasHydrated || syncingRef.current) return;

    const run = async () => {
      if (ownerId !== targetOwnerId) {
        setOwner(targetOwnerId);
        if (targetOwnerId && isAuthenticated) {
          syncingRef.current = true;
          try {
            const serverCart = await fetchCart();
            if (serverCart.success && serverCart.data) {
              const normalized = mapServerItemsToCartItems(serverCart.data.items);
              replaceItems(normalized);
            } else {
              replaceItems([]);
            }
          } catch (error) {
            console.error("Cart sync fetch failed:", error);
            replaceItems([]);
          } finally {
            syncingRef.current = false;
            setInitialSyncDone(true);
          }
        } else {
          replaceItems([]);
          setInitialSyncDone(true);
        }
        return;
      }

      if (!initialSyncDone && isAuthenticated) {
        syncingRef.current = true;
        try {
          await syncCart(buildSyncPayload(useCartStore.getState().items));
          const serverCart = await fetchCart();
          if (serverCart.success && serverCart.data) {
            replaceItems(mapServerItemsToCartItems(serverCart.data.items));
          }
        } catch (error) {
          console.error("Initial cart sync failed:", error);
        } finally {
          syncingRef.current = false;
          setInitialSyncDone(true);
        }
      } else if (!initialSyncDone) {
        setInitialSyncDone(true);
      }
    };

    run();
  }, [
    hasHydrated,
    ownerId,
    targetOwnerId,
    replaceItems,
    isAuthenticated,
    setOwner,
    initialSyncDone,
  ]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !hasHydrated ||
      !initialSyncDone ||
      ownerId !== targetOwnerId ||
      syncingRef.current
    ) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const payload = buildSyncPayload(items);
      syncCart(payload).catch((error) => {
        console.error("Cart sync failed:", error);
      });
    }, 600);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [items, isAuthenticated, hasHydrated, initialSyncDone, ownerId, targetOwnerId]);
};

