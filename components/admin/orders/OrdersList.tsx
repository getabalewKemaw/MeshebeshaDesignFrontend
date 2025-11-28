import { RefreshCw, Package } from "lucide-react";
import OrderListItem from "./OrderListItem";
import type { AdminOrder, PaginationMeta } from "@/types/order";

interface OrdersListProps {
    orders: AdminOrder[];
    loading: boolean;
    pagination: PaginationMeta;
    selectedOrderId: string | null;
    selectedOrderIds: Set<string>;
    onViewOrder: (orderId: string) => void;
    onToggleSelection: (orderId: string) => void;
    onSelectAll: () => void;
    onPageChange: (page: number) => void;
}

export default function OrdersList({
    orders,
    loading,
    pagination,
    selectedOrderId,
    selectedOrderIds,
    onViewOrder,
    onToggleSelection,
    onSelectAll,
    onPageChange,
}: OrdersListProps) {
    const canGoPrev = pagination.page > 1;
    const canGoNext = pagination.page < (pagination?.totalPages || 1);

    return (
        <div className="bg-white shadow-sm">
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
                        onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                        className={`form-button-secondary text-sm py-1 px-3 ${!canGoPrev ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        Prev
                    </button>
                    <button
                        type="button"
                        disabled={!canGoNext}
                        onClick={() =>
                            onPageChange(
                                pagination.totalPages
                                    ? Math.min(pagination.totalPages, pagination.page + 1)
                                    : pagination.page + 1
                            )
                        }
                        className={`form-button-secondary text-sm py-1 px-3 ${!canGoNext ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {loading ? (
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
                    {orders.length > 0 && (
                        <li className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedOrderIds.size === orders.length && orders.length > 0}
                                    onChange={onSelectAll}
                                    className="w-4 h-4 text-black rounded-none border-gray-300 focus:ring-black"
                                />
                                <span className="text-sm font-medium text-gray-700">Select All</span>
                            </label>
                        </li>
                    )}
                    {orders.map((order) => (
                        <OrderListItem
                            key={order.id}
                            order={order}
                            isSelected={selectedOrderId === order.id}
                            isViewing={selectedOrderId === order.id}
                            isChecked={selectedOrderIds.has(order.id)}
                            onView={onViewOrder}
                            onToggleCheck={onToggleSelection}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
