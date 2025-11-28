import type { ApiResponse } from "@/types/product";
import type { AdminOrder, PaginationMeta } from "@/types/order";
import { apiRequest } from "../request";

export const listAdminOrders = (params: {
  status?: string;
  page?: number;
  search?: string;
}) => {
  const query = new URLSearchParams();

  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", params.page.toString());
  if (params.search) query.set("search", params.search);

  const qs = query.toString();
  const suffix = qs ? `?${qs}` : "";

  return apiRequest<AdminOrder[]>(`/api/v1/admin/orders${suffix}`, {
    method: "GET",
  });
};

export const getAdminOrder = (orderId: string) =>
  apiRequest<AdminOrder>(`/api/v1/admin/orders/${orderId}`, {
    method: "GET",
  });

export const updateAdminOrderStatus = (
  orderId: string,
  status: string,
  note?: string
) =>
  apiRequest<AdminOrder>(`/api/v1/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: {
      status,
      ...(note ? { note } : {}),
    },
  });

export const bulkUpdateAdminOrderStatus = (
  orderIds: string[],
  status: string,
  note?: string
) =>
  apiRequest<{ successful: number; failed: number; orders: AdminOrder[] }>(
    `/api/v1/admin/orders/bulk/status`,
    {
      method: "PATCH",
      body: {
        orderIds,
        status,
        ...(note ? { note } : {}),
      },
    }
  );

