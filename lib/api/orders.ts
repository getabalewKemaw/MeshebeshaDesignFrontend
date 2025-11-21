import type { ApiResponse } from "@/types/product";
import type {
  CreateOrderPayload,
  OrderPreview,
  OrderSummary,
} from "@/types/order";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function ordersRequest<T>(
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
    console.error("Orders API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

export const previewOrder = (payload: CreateOrderPayload) =>
  ordersRequest<OrderPreview>("/api/v1/orders/preview", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createOrder = (payload: CreateOrderPayload) =>
  ordersRequest<OrderSummary>("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const submitFakePayment = (orderId: string, reference: string, note?: string) =>
  ordersRequest<OrderSummary>(`/api/v1/orders/${orderId}/fake-payment`, {
    method: "POST",
    body: JSON.stringify({ reference, note }),
  });

