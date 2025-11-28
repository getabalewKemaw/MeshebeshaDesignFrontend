import { useState, useCallback } from "react";
import { updateAdminOrderStatus } from "@/lib/api/admin/orders";
import type { AdminOrder } from "@/types/order";

export function useOrderStatusUpdate() {
    const [pendingStatus, setPendingStatus] = useState<string>("");
    const [statusNote, setStatusNote] = useState("");
    const [updating, setUpdating] = useState(false);

    const updateStatus = useCallback(async (
        order: AdminOrder,
        onSuccess: (updatedOrder: AdminOrder, statusLabel: string) => void,
        onError: (error: string) => void
    ) => {
        if (!order || !pendingStatus || pendingStatus === order.status) {
            return;
        }
        setUpdating(true);
        const response = await updateAdminOrderStatus(
            order.id,
            pendingStatus,
            statusNote || undefined
        );

        if (response.success && response.data) {
            const updated = response.data;
            const label = pendingStatus.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
            onSuccess(updated, label);
            setStatusNote("");
        } else {
            onError(response.error || "Failed to update order status.");
        }
        setUpdating(false);
    }, [pendingStatus, statusNote]);

    const resetStatus = useCallback((status: string) => {
        setPendingStatus(status);
        setStatusNote("");
    }, []);

    return {
        pendingStatus,
        statusNote,
        updating,
        setPendingStatus,
        setStatusNote,
        updateStatus,
        resetStatus,
    };
}
