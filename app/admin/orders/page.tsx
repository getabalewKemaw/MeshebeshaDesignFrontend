"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, RefreshCw, ClipboardList, Truck } from "lucide-react";

import Navbar from "@/components/NavBar";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  getAdminOrder,
  listAdminOrders,
  updateAdminOrderStatus,
} from "@/lib/api/admin/orders";
import type { AdminOrder, PaginationMeta, ShippingInfo } from "@/types/order";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

const statusLabel = (status: string) =>
  status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const DEFAULT_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const formatAddress = (info?: ShippingInfo | null) => {
  if (!info?.address) return "No address provided";
  const { mode, formattedAddress, line1, line2, city, state, country, postalCode } =
    info.address;

  if (mode === "google" && formattedAddress) {
    return formattedAddress;
  }

  const manualParts = [line1, line2, city, state, postalCode, country]
    .filter(Boolean)
    .join(", ");

  return manualParts || "No address provided";
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchTerm.trim());

  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedOrderIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  const applySelectedOrder = (
    order: AdminOrder | null,
    options?: { preserveMessage?: boolean }
  ) => {
    selectedOrderIdRef.current = order?.id ?? null;
    setSelectedOrder(order);
    setPendingStatus(order?.status ?? "");
    if (!options?.preserveMessage) {
      setStatusMessage(null);
    }
    setStatusNote("");
  };

  useEffect(() => {
    if (!isAdmin) return;
    const loadOrders = async () => {
      setListLoading(true);
      setErrorMessage(null);
      const response = await listAdminOrders({
        status: statusFilter !== "all" ? statusFilter : undefined,
        page,
        search: deferredSearch || undefined,
      });

      if (response.success && response.data) {
        setOrders(response.data);
        setPagination(
          response.pagination ?? {
            total: response.data.length,
            page,
            limit: 10,
            totalPages: 1,
          }
        );
        const currentId = selectedOrderIdRef.current;
        const nextSelected = response.data.length
          ? currentId
            ? response.data.find((order) => order.id === currentId) ?? response.data[0]
            : response.data[0]
          : null;
        applySelectedOrder(nextSelected);
      } else {
        setOrders([]);
        setPagination(DEFAULT_PAGINATION);
        applySelectedOrder(null);
        setErrorMessage(response.error || "Failed to fetch orders.");
      }

      setListLoading(false);
    };

    loadOrders();
  }, [isAdmin, page, statusFilter, deferredSearch]);

  const handleViewOrder = async (orderId: string) => {
    if (!orderId) return;
    setDetailLoading(true);
    const response = await getAdminOrder(orderId);
    if (response.success && response.data) {
      applySelectedOrder(response.data);
    } else {
      setStatusMessage(null);
      setErrorMessage(response.error || "Failed to load order details.");
    }
    setDetailLoading(false);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !pendingStatus || pendingStatus === selectedOrder.status) {
      return;
    }
    setUpdatingStatus(true);
    setStatusMessage(null);
    const response = await updateAdminOrderStatus(
      selectedOrder.id,
      pendingStatus,
      statusNote || undefined
    );

    if (response.success && response.data) {
      const updated = response.data;
      applySelectedOrder(updated, { preserveMessage: true });
      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order))
      );
      setStatusMessage(`Status updated to ${statusLabel(updated.status)}.`);
      setStatusNote("");
    } else {
      setErrorMessage(response.error || "Failed to update order status.");
    }
    setUpdatingStatus(false);
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setPage(1);
  };

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: selectedOrder?.currency || "USD",
      }),
    [selectedOrder?.currency]
  );

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p>Checking admin access...</p>
        </div>
      </div>
    );
  }

  const canGoPrev = page > 1;
  const canGoNext = page < (pagination?.totalPages || 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">
            Track customer orders, review delivery preferences, and update fulfillment status.
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number or customer"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    if (page !== 1) {
                      setPage(1);
                    }
                  }}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setStatusFilter(option.value);
                    if (page !== 1) {
                      setPage(1);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === option.value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-500">
                    Showing page {pagination.page} of {pagination.totalPages}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!canGoPrev}
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      canGoPrev ? "text-indigo-600 hover:bg-indigo-50" : "text-gray-400"
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() =>
                      setPage((prev) =>
                        pagination.totalPages ? Math.min(pagination.totalPages, prev + 1) : prev + 1
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      canGoNext ? "text-indigo-600 hover:bg-indigo-50" : "text-gray-400"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>

              {listLoading ? (
                <div className="p-10 flex items-center justify-center text-gray-500">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span className="ml-2 text-sm">Loading orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Package className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium">No orders found for this filter.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="px-4 sm:px-6 py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between hover:bg-gray-50"
                    >
                      <div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="font-semibold text-gray-900">
                            {order.orderNumber}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.user?.name ?? "Unknown customer"}
                          {order.user?.email ? ` • ${order.user.email}` : ""}
                        </div>
                        <div className="text-base font-semibold text-gray-900 mt-1">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: order.currency,
                          }).format(order.total)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_BADGE_STYLES[order.status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusLabel(order.status)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleViewOrder(order.id)}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          View
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl shadow p-5 space-y-4">
              {detailLoading ? (
                <div className="flex items-center justify-center text-gray-500">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span className="ml-2 text-sm">Loading order details...</span>
                </div>
              ) : !selectedOrder ? (
                <div className="text-center text-gray-500 p-4">
                  <ClipboardList className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <p>Select an order to view details</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedOrder.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last updated{" "}
                        {new Date(selectedOrder.updatedAt ?? selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_BADGE_STYLES[selectedOrder.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabel(selectedOrder.status)}
                    </span>
                  </div>

                  {statusMessage && (
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                      {statusMessage}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Update Status
                      </label>
                      <select
                        value={pendingStatus}
                        onChange={(event) => setPendingStatus(event.target.value)}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        {STATUS_OPTIONS.filter((option) => option.value !== "all").map(
                          (option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        Internal Note (optional)
                      </label>
                      <textarea
                        value={statusNote}
                        onChange={(event) => setStatusNote(event.target.value)}
                        rows={3}
                        placeholder="Visible to admins for auditing"
                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleStatusUpdate}
                      disabled={updatingStatus || pendingStatus === selectedOrder.status}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {updatingStatus ? "Updating..." : "Save Status"}
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Customer</p>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.user?.name ?? "Unknown"}
                      </p>
                      {selectedOrder.user?.email && (
                        <p className="text-xs text-gray-500">{selectedOrder.user.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Total</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {currencyFormatter.format(selectedOrder.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Shipping Address</p>
                      <p className="text-sm text-gray-900">
                        {formatAddress(selectedOrder.shippingInfo)}
                      </p>
                      {selectedOrder.shippingInfo?.contact?.phone && (
                        <p className="text-xs text-gray-500">
                          Phone: {selectedOrder.shippingInfo.contact.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Delivery Preference</p>
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span>
                            {selectedOrder.shippingInfo?.deliveryPreference?.speed === "express"
                              ? "Express (1-2 days)"
                              : "Standard (3-5 days)"}
                          </span>
                        </div>
                        {selectedOrder.shippingInfo?.deliveryPreference?.preferredDate && (
                          <p className="text-xs text-gray-500">
                            Preferred date:{" "}
                            {selectedOrder.shippingInfo.deliveryPreference.preferredDate}
                          </p>
                        )}
                        {selectedOrder.shippingInfo?.deliveryPreference?.preferredWindow && (
                          <p className="text-xs text-gray-500">
                            Window:{" "}
                            {selectedOrder.shippingInfo.deliveryPreference.preferredWindow}
                          </p>
                        )}
                        {selectedOrder.shippingInfo?.deliveryPreference?.instructions && (
                          <p className="text-xs text-gray-500">
                            Note: {selectedOrder.shippingInfo.deliveryPreference.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">Line Items</p>
                      <span className="text-xs text-gray-500">
                        {selectedOrder.items.length} products
                      </span>
                    </div>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.variantId}
                          className="rounded-xl border border-gray-100 p-3 text-sm"
                        >
                          <div className="flex items-center justify-between text-gray-900">
                            <span className="font-medium">{item.title}</span>
                            <span>{currencyFormatter.format(item.unitPrice * item.quantity)}</span>
                          </div>
                          <div className="text-xs text-gray-500 flex justify-between">
                            <span>
                              {item.quantity} × {currencyFormatter.format(item.unitPrice)}
                            </span>
                            {item.product?.title && <span>{item.product.title}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <p className="text-sm font-semibold text-gray-900">Payments</p>
                      <div className="space-y-3 text-sm">
                        {selectedOrder.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="rounded-xl border border-gray-100 p-3 space-y-1"
                          >
                            <div className="flex items-center justify-between text-gray-900">
                              <span className="font-medium">{payment.provider}</span>
                              <span className="text-xs uppercase tracking-wide">
                                {payment.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Amount:{" "}
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: payment.currency,
                              }).format(payment.amount)}
                            </div>
                            {payment.providerTx && (
                              <div className="text-xs text-gray-500">
                                Reference: {payment.providerTx}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

