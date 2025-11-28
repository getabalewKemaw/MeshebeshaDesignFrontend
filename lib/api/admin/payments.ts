import type { ApiResponse } from "@/types/product";
import { apiRequest } from "../request";

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
}) => {
  const query = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
  }

  const qs = query.toString();
  const suffix = qs ? `?${qs}` : "";

  return apiRequest<PaymentListResponse["data"]>(`/api/v1/admin/payments${suffix}`, {
    method: "GET",
  });
};

export const getAdminPayment = (paymentId: string) =>
  apiRequest<AdminPayment>(`/api/v1/admin/payments/${paymentId}`, {
    method: "GET",
  });

export const markPaymentPaid = (paymentId: string, note?: string) =>
  apiRequest<{ paymentId: string; status: string }>(
    `/api/v1/admin/payments/${paymentId}/mark-paid`,
    {
      method: "PATCH",
      body: { note },
    }
  );

export const markPaymentRefunded = (paymentId: string, refundAmount?: number, note?: string) =>
  apiRequest<{ paymentId: string; status: string; refundAmount: number }>(
    `/api/v1/admin/payments/${paymentId}/refund`,
    {
      method: "PATCH",
      body: { refundAmount, note },
    }
  );





