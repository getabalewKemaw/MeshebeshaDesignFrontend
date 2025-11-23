import type { ApiResponse } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function adminPaymentRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(buildUrl(path), {
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
    console.error("Admin payment API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

export interface AdminPayment {
  id: string;
  orderId: string;
  provider: string;
  chapaRef: string | null;
  amount: number;
  currency: string;
  status: string;
  idempotencyKey: string | null;
  createdAt: string;
  updatedAt: string;
  order: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    userId: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface PaymentListResponse {
  success: boolean;
  data: AdminPayment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const listAdminPayments = (params?: {
  status?: string;
  provider?: string;
  orderId?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) =>
  adminPaymentRequest<PaymentListResponse["data"]>("/api/v1/admin/payments", {
    method: "GET",
  });

export const getAdminPayment = (paymentId: string) =>
  adminPaymentRequest<AdminPayment>(`/api/v1/admin/payments/${paymentId}`, {
    method: "GET",
  });

export const markPaymentPaid = (paymentId: string, note?: string) =>
  adminPaymentRequest<{ paymentId: string; status: string }>(
    `/api/v1/admin/payments/${paymentId}/mark-paid`,
    {
      method: "PATCH",
      body: JSON.stringify({ note }),
    }
  );

export const markPaymentRefunded = (paymentId: string, refundAmount?: number, note?: string) =>
  adminPaymentRequest<{ paymentId: string; status: string; refundAmount: number }>(
    `/api/v1/admin/payments/${paymentId}/refund`,
    {
      method: "PATCH",
      body: JSON.stringify({ refundAmount, note }),
    }
  );



