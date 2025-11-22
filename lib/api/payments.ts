import type { ApiResponse } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function paymentRequest<T>(
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
    console.error("Payment API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

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
  return paymentRequest<CreatePaymentResponse['data']>("/api/v1/payments/create", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

/**
 * Get payment status
 */
export async function getPayment(paymentId: string): Promise<ApiResponse<PaymentStatus>> {
  return paymentRequest<PaymentStatus>(`/api/v1/payments/${paymentId}`, {
    method: "GET",
  });
}

/**
 * Get payments for an order
 */
export async function getOrderPayments(orderId: string): Promise<ApiResponse<PaymentStatus[]>> {
  return paymentRequest<PaymentStatus[]>(`/api/v1/payments/order/${orderId}`, {
    method: "GET",
  });
}

