"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useOrders } from "@/lib/hooks/admin/useOrders";
import { useOrderSelection } from "@/lib/hooks/admin/useOrderSelection";
import { useOrderStatusUpdate } from "@/lib/hooks/admin/useOrderStatusUpdate";
import AlertMessage from "@/components/admin/AlertMessage";
import OrderFilters from "@/components/admin/orders/OrderFilters";
import BulkActionsBar from "@/components/admin/orders/BulkActionsBar";
import OrdersList from "@/components/admin/orders/OrdersList";
import OrderDetails from "@/components/admin/orders/OrderDetails";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuth();

  // Filter and pagination state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(searchTerm.trim());

  // Message state
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Custom hooks
  const {
    orders,
    pagination,
    loading,
    selectedOrder,
    detailLoading,
    errorMessage: ordersError,
    fetchOrders,
    selectOrder,
    updateOrderInList,
  } = useOrders();

  const {
    selectedOrderIds,
    bulkStatus,
    bulkUpdating,
    toggleSelection,
    selectAll,
    clearSelection,
    setBulkStatus,
    bulkUpdateStatus,
  } = useOrderSelection();

  const {
    pendingStatus,
    statusNote,
    updating,
    setPendingStatus,
    setStatusNote,
    updateStatus,
    resetStatus,
  } = useOrderStatusUpdate();

  // Auth redirect
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  // Fetch orders when filters change
  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders(statusFilter, page, deferredSearch);
  }, [isAdmin, page, statusFilter, deferredSearch, fetchOrders]);

  // Update pending status when selected order changes
  useEffect(() => {
    if (selectedOrder) {
      resetStatus(selectedOrder.status);
    }
  }, [selectedOrder, resetStatus]);

  // Handlers
  const handleResetFilters = () => {
    setStatusFilter("all");
    setSearchTerm("");
    setPage(1);
    clearSelection();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    if (page !== 1) {
      setPage(1);
    }
  };

  const handleSelectAll = () => {
    selectAll(orders.map((o) => o.id));
  };

  const handleBulkUpdate = async () => {
    setErrorMessage(null);
    setStatusMessage(null);
    await bulkUpdateStatus(
      (successCount, totalCount) => {
        setStatusMessage(`Updated ${successCount} of ${totalCount} orders`);
        // Reload orders
        fetchOrders(statusFilter, page, deferredSearch);
      },
      (error) => {
        setErrorMessage(error);
      }
    );
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    setStatusMessage(null);
    setErrorMessage(null);
    await updateStatus(
      selectedOrder,
      (updatedOrder, label) => {
        updateOrderInList(updatedOrder);
        setStatusMessage(`Status updated to ${label}.`);
      },
      (error) => {
        setErrorMessage(error);
      }
    );
  };

  // Show message helper
  useEffect(() => {
    if (statusMessage || errorMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage, errorMessage]);

  if (isLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center py-16 bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p>Checking admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">
          Track customer orders, review delivery preferences, and update fulfillment status.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-4">
        {/* Bulk Actions */}
        {selectedOrderIds.size > 0 && (
          <BulkActionsBar
            selectedCount={selectedOrderIds.size}
            bulkStatus={bulkStatus}
            updating={bulkUpdating}
            onBulkStatusChange={setBulkStatus}
            onBulkUpdate={handleBulkUpdate}
            onCancel={clearSelection}
          />
        )}

        {/* Filters */}
        <OrderFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusFilterChange}
          onReset={handleResetFilters}
        />

        {/* Messages */}
        {(errorMessage || ordersError) && (
          <AlertMessage message={errorMessage || ordersError || ""} type="error" />
        )}
        {statusMessage && <AlertMessage message={statusMessage} type="success" />}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        {/* Orders List */}
        <div className="space-y-4">
          <OrdersList
            orders={orders}
            loading={loading}
            pagination={pagination}
            selectedOrderId={selectedOrder?.id || null}
            selectedOrderIds={selectedOrderIds}
            onViewOrder={selectOrder}
            onToggleSelection={toggleSelection}
            onSelectAll={handleSelectAll}
            onPageChange={setPage}
          />
        </div>

        {/* Order Details */}
        <aside className="space-y-4">
          <OrderDetails
            order={selectedOrder}
            loading={detailLoading}
            pendingStatus={pendingStatus}
            statusNote={statusNote}
            updating={updating}
            statusMessage={statusMessage}
            onStatusChange={setPendingStatus}
            onNoteChange={setStatusNote}
            onStatusUpdate={handleStatusUpdate}
          />
        </aside>
      </section>
    </div>
  );
}
