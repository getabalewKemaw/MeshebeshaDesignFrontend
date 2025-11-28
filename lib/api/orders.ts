import type { ApiResponse } from "@/types/product";
import type {
  CreateOrderPayload,
  OrderPreview,
  OrderSummary,
} from "@/types/order";
import { apiRequest } from "./request";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const previewOrder = (payload: CreateOrderPayload) =>
  apiRequest<OrderPreview>("/api/v1/orders/preview", {
    method: "POST",
    body: payload,
  });

export const createOrder = (payload: CreateOrderPayload) =>
  apiRequest<OrderSummary>("/api/v1/orders", {
    method: "POST",
    body: payload,
  });

export const submitFakePayment = (orderId: string, reference: string, note?: string) =>
  apiRequest<OrderSummary>(`/api/v1/orders/${orderId}/fake-payment`, {
    method: "POST",
    body: { reference, note },
  });

export const getUserOrders = () =>
  apiRequest<OrderSummary[]>("/api/v1/orders", {
    method: "GET",
  });

