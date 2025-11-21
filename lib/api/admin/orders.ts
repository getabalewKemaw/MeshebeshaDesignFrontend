import type { ApiResponse } from "@/types/product";
import type { AdminOrder, PaginationMeta } from "@/types/order";

const resolveBaseUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  if (!base) return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

const ADMIN_ORDERS_URL = `${resolveBaseUrl()}/api/v1/admin/orders`;

type AdminOrdersListResponse = ApiResponse<AdminOrder[]> & {
  pagination?: PaginationMeta;
};

const buildUrl = (suffix: string) => {
  if (!suffix) return ADMIN_ORDERS_URL;
  if (suffix.startsWith("?") || suffix.startsWith("/")) {
    return `${ADMIN_ORDERS_URL}${suffix}`;
  }
  return `${ADMIN_ORDERS_URL}/${suffix}`;
};

async function adminOrdersRequest<T extends ApiResponse<unknown>>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(buildUrl(path), {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    return (await response.json()) as T;
  } catch (error) {
    console.error("Admin orders request failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to reach admin orders API",
    } as T;
  }
}

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

  return adminOrdersRequest<AdminOrdersListResponse>(`${suffix}`, {
    method: "GET",
  });
};

export const getAdminOrder = (orderId: string) =>
  adminOrdersRequest<ApiResponse<AdminOrder>>(`/${orderId}`, {
    method: "GET",
  });

export const updateAdminOrderStatus = (
  orderId: string,
  status: string,
  note?: string
) =>
  adminOrdersRequest<ApiResponse<AdminOrder>>(`/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      ...(note ? { note } : {}),
    }),
  });

export const bulkUpdateAdminOrderStatus = (
  orderIds: string[],
  status: string,
  note?: string
) =>
  adminOrdersRequest<ApiResponse<{ successful: number; failed: number; orders: AdminOrder[] }>>(
    `/bulk/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        orderIds,
        status,
        ...(note ? { note } : {}),
      }),
    }
  );

