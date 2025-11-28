import { useState, useCallback } from "react";
import { bulkUpdateAdminOrderStatus } from "@/lib/api/admin/orders";

export function useOrderSelection() {
    const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
    const [bulkStatus, setBulkStatus] = useState<string>("");
    const [bulkUpdating, setBulkUpdating] = useState(false);

    const toggleSelection = useCallback((orderId: string) => {
        setSelectedOrderIds((prev) => {
            const next = new Set(prev);
            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }
            return next;
        });
    }, []);

    const selectAll = useCallback((orderIds: string[]) => {
        setSelectedOrderIds((prev) => {
            if (prev.size === orderIds.length) {
                return new Set();
            } else {
                return new Set(orderIds);
            }
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedOrderIds(new Set());
        setBulkStatus("");
    }, []);

    const bulkUpdateStatus = useCallback(async (
        onSuccess: (successCount: number, totalCount: number) => void,
        onError: (error: string) => void
    ) => {
        if (selectedOrderIds.size === 0 || !bulkStatus) {
            onError("Please select orders and choose a status");
            return;
        }

        setBulkUpdating(true);

        const response = await bulkUpdateAdminOrderStatus(
            Array.from(selectedOrderIds),
            bulkStatus
        );

        if (response.success && response.data) {
            onSuccess(response.data.successful, selectedOrderIds.size);
            clearSelection();
        } else {
            onError(response.error || "Failed to update orders");
        }

        setBulkUpdating(false);
    }, [selectedOrderIds, bulkStatus, clearSelection]);

    return {
        selectedOrderIds,
        bulkStatus,
        bulkUpdating,
        toggleSelection,
        selectAll,
        clearSelection,
        setBulkStatus,
        bulkUpdateStatus,
    };
}
