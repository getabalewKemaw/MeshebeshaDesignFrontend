import type { ApiResponse } from "@/types/product";
import type { CartSyncItem, ServerCartSnapshot } from "@/types/cart";
import { apiRequest } from "./request";

/* below the ff, we include the  ServerCartSnapshot in all fucnctions
  becuase the  server  is a  single source of truth so each action  need the latest server action in the cart   
  
  so returning that make the server and the client synchroiized   at all times.
  */
export const fetchCart = () => apiRequest<ServerCartSnapshot>("/api/v1/cart");


// used to sync the cart items from the client and the server.
export const syncCart = (items: CartSyncItem[]) =>
  apiRequest<ServerCartSnapshot>("/api/v1/cart", {
    method: "PUT",
    body: { items },
  });


export const updateCartItem = (variantId: string, quantity: number) =>
  apiRequest<ServerCartSnapshot>(`/api/v1/cart/items/${variantId}`, {
    method: "PATCH",
    body: { quantity },
  });

export const removeCartItem = (variantId: string) =>
  apiRequest<ServerCartSnapshot>(`/api/v1/cart/items/${variantId}`, {
    method: "DELETE",
  });

export const clearCart = () =>
  apiRequest<ServerCartSnapshot>("/api/v1/cart", {
    method: "DELETE",
  });

