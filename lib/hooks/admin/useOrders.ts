import { useState, useCallback, useRef } from "react";
import { getAdminOrder, listAdminOrders } from "@/lib/api/admin/orders";
import type { AdminOrder, PaginationMeta } from "@/types/order";

const DEFAULT_PAGINATION: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
};

export function useOrders() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const selectedOrderIdRef = useRef<string | null>(null);

    const applySelectedOrder = useCallback((
        order: AdminOrder | null,
        options?: { preserveMessage?: boolean }
    ) => {
        selectedOrderIdRef.current = order?.id ?? null;
        setSelectedOrder(order);
        if (!options?.preserveMessage) {
            // Message handling is done in parent component
        }
        setErrorMessage(null);
    }, []);

    const fetchOrders = useCallback(async (
        statusFilter: string,
        page: number,
        searchTerm: string
    ) => {
        setLoading(true);
        setErrorMessage(null);
        const response = await listAdminOrders({
            status: statusFilter !== "all" ? statusFilter : undefined,
            page,
            search: searchTerm || undefined,
        });

        if (response.success && response.data) {
            const ordersData = response.data;
            setOrders(ordersData);

            // Convert API pagination (with offset) to PaginationMeta (with page)
            if (response.pagination) {
                setPagination({
                    total: response.pagination.total,
                    page: page,
                    limit: response.pagination.limit,
                    totalPages: response.pagination.totalPages,
                });
            } else {
                setPagination({
                    total: ordersData.length,
                    page,
                    limit: 10,
                    totalPages: 1,
                });
            }

            const currentId = selectedOrderIdRef.current;
            const nextSelected = ordersData.length
                ? currentId
                    ? ordersData.find((order: AdminOrder) => order.id === currentId) ?? ordersData[0]
                    : ordersData[0]
                : null;
            applySelectedOrder(nextSelected);
        } else {
            setOrders([]);
            setPagination(DEFAULT_PAGINATION);
            applySelectedOrder(null);
            setErrorMessage(response.error || "Failed to fetch orders.");
        }

        setLoading(false);
    }, [applySelectedOrder]);

    const selectOrder = useCallback(async (orderId: string) => {
        if (!orderId) return;
        setDetailLoading(true);
        const response = await getAdminOrder(orderId);
        if (response.success && response.data) {
            const orderData = response.data;
            applySelectedOrder(orderData);
        } else {
            setErrorMessage(response.error || "Failed to load order details.");
        }
        setDetailLoading(false);
    }, [applySelectedOrder]);

    const updateOrderInList = useCallback((updatedOrder: AdminOrder) => {
        setOrders((prev) =>
            prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
        );
        applySelectedOrder(updatedOrder, { preserveMessage: true });
    }, [applySelectedOrder]);

    return {
        orders,
        pagination,
        loading,
        selectedOrder,
        detailLoading,
        errorMessage,
        fetchOrders,
        selectOrder,
        updateOrderInList,
    };
}
