import type { ApiResponse } from "@/types/product";
import { apiRequest } from "./request";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface CreatePaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    checkoutUrl: string;
    chapaRef: string;
  };
}

export interface PaymentStatus {
  id: string;
  orderId: string;
  provider: string;
  chapaRef: string | null;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create a payment session with Chapa
 */
export async function createPayment(orderId: string): Promise<ApiResponse<CreatePaymentResponse['data']>> {
  return apiRequest<CreatePaymentResponse['data']>("/api/v1/payments/create", {
    method: "POST",
    body: { orderId },
  });
}

/**
 * Get payment status
 */
export async function getPayment(paymentId: string): Promise<ApiResponse<PaymentStatus>> {
  return apiRequest<PaymentStatus>(`/api/v1/payments/${paymentId}`, {
    method: "GET",
  });
}

/**
 * Get payments for an order
 */
export async function getOrderPayments(orderId: string): Promise<ApiResponse<PaymentStatus[]>> {
  return apiRequest<PaymentStatus[]>(`/api/v1/payments/order/${orderId}`, {
    method: "GET",
  });
}

