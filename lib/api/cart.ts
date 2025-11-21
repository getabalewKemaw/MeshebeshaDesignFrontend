import type { ApiResponse } from "@/types/product";
import type { CartSyncItem, ServerCartSnapshot } from "@/types/cart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function cartRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Cart API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

export const fetchCart = () => cartRequest<ServerCartSnapshot>("/api/v1/cart");

export const syncCart = (items: CartSyncItem[]) =>
  cartRequest<ServerCartSnapshot>("/api/v1/cart", {
    method: "PUT",
    body: JSON.stringify({ items }),
  });

export const updateCartItem = (variantId: string, quantity: number) =>
  cartRequest<ServerCartSnapshot>(`/api/v1/cart/items/${variantId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const removeCartItem = (variantId: string) =>
  cartRequest<ServerCartSnapshot>(`/api/v1/cart/items/${variantId}`, {
    method: "DELETE",
  });

export const clearCart = () =>
  cartRequest<ServerCartSnapshot>("/api/v1/cart", {
    method: "DELETE",
  });

