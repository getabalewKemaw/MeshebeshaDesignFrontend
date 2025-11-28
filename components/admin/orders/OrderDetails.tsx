import { useMemo } from "react";
import { RefreshCw, ClipboardList, Truck } from "lucide-react";
import OrderStatusUpdate from "./OrderStatusUpdate";
import OrderItemsList from "./OrderItemsList";
import PaymentsList from "./PaymentsList";
import type { AdminOrder, ShippingInfo } from "@/types/order";

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

interface OrderDetailsProps {
    order: AdminOrder | null;
    loading: boolean;
    pendingStatus: string;
    statusNote: string;
    updating: boolean;
    statusMessage: string | null;
    onStatusChange: (status: string) => void;
    onNoteChange: (note: string) => void;
    onStatusUpdate: () => void;
}

export default function OrderDetails({
    order,
    loading,
    pendingStatus,
    statusNote,
    updating,
    statusMessage,
    onStatusChange,
    onNoteChange,
    onStatusUpdate,
}: OrderDetailsProps) {
    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: order?.currency || "USD",
            }),
        [order?.currency]
    );

    if (loading) {
        return (
            <div className="bg-white shadow p-5 space-y-4">
                <div className="flex items-center justify-center text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="ml-2 text-sm">Loading order details...</span>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-white shadow p-5 space-y-4">
                <div className="text-center text-gray-500 p-4">
                    <ClipboardList className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <p>Select an order to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow p-5 space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500">Order</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                        Last updated{" "}
                        {new Date(order.updatedAt ?? order.createdAt).toLocaleString()}
                    </p>
                </div>
                <span
                    className={`px-3 py-1 text-xs font-semibold ${STATUS_BADGE_STYLES[order.status] ||
                        "bg-gray-100 text-gray-600"
                        }`}
                >
                    {statusLabel(order.status)}
                </span>
            </div>

            {statusMessage && (
                <div className="border border-green-100 bg-green-50 px-3 py-2 text-xs text-green-700">
                    {statusMessage}
                </div>
            )}

            <OrderStatusUpdate
                currentStatus={order.status}
                pendingStatus={pendingStatus}
                statusNote={statusNote}
                updating={updating}
                onStatusChange={onStatusChange}
                onNoteChange={onNoteChange}
                onUpdate={onStatusUpdate}
            />

            <div className="border-t border-gray-100 pt-4 space-y-3">
                <div>
                    <p className="text-xs font-medium text-gray-500">Customer</p>
                    <p className="text-sm text-gray-900">
                        {order.user?.name ?? "Unknown"}
                    </p>
                    {order.user?.email && (
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                    )}
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {currencyFormatter.format(order.total)}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500">Shipping Address</p>
                    <p className="text-sm text-gray-900">
                        {formatAddress(order.shippingInfo)}
                    </p>
                    {order.shippingInfo?.contact?.phone && (
                        <p className="text-xs text-gray-500">
                            Phone: {order.shippingInfo.contact.phone}
                        </p>
                    )}
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500">Delivery Preference</p>
                    <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-gray-500" />
                            <span>
                                {order.shippingInfo?.deliveryPreference?.speed === "express"
                                    ? "Express (1-2 days)"
                                    : "Standard (3-5 days)"}
                            </span>
                        </div>
                        {order.shippingInfo?.deliveryPreference?.preferredDate && (
                            <p className="text-xs text-gray-500">
                                Preferred date:{" "}
                                {order.shippingInfo.deliveryPreference.preferredDate}
                            </p>
                        )}
                        {order.shippingInfo?.deliveryPreference?.preferredWindow && (
                            <p className="text-xs text-gray-500">
                                Window:{" "}
                                {order.shippingInfo.deliveryPreference.preferredWindow}
                            </p>
                        )}
                        {order.shippingInfo?.deliveryPreference?.instructions && (
                            <p className="text-xs text-gray-500">
                                Note: {order.shippingInfo.deliveryPreference.instructions}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <OrderItemsList items={order.items} currencyFormatter={currencyFormatter} />
            <PaymentsList payments={order.payments || []} />
        </div>
    );
}
