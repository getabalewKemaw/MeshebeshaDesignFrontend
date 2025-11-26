import React from "react";
import Image from "next/image";
import type { OrderSummary } from "@/types/order";
import { formatCurrency, formatDate } from "@/lib/utils/product-utils";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderCardProps {
    order: OrderSummary;
    onViewDetails: (order: OrderSummary) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
    const items = order.items || [];
    const itemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const displayItems = items.slice(0, 3);
    const remainingItems = items.length - 3;

    return (
        <div
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-bold text-[#1E2A55]">#{order.orderNumber || order.id.slice(0, 8)}</span>
                        <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-sm text-gray-500">
                        {formatDate(order.createdAt)} • {itemCount} Item{itemCount !== 1 ? 's' : ''}
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-xl font-bold text-[#1E2A55]">
                        {formatCurrency(order.total, order.currency)}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-6"></div>

            {/* Body - Items Preview */}
            <div className="p-6">
                <div className="mb-4 sm:hidden flex justify-between items-center pb-4 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-lg font-bold text-[#1E2A55]">
                        {formatCurrency(order.total, order.currency)}
                    </span>
                </div>

                <div className="space-y-4">
                    {displayItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 relative">
                                    {item.product?.image ? (
                                        <Image
                                            src={item.product.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                                        {item.title || item.product?.title || "Product"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">
                                {formatCurrency(item.unitPrice * item.quantity, order.currency)}
                            </span>
                        </div>
                    ))}

                    {remainingItems > 0 && (
                        <div className="pl-16 text-sm text-gray-500">
                            +{remainingItems} more item{remainingItems > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer - Actions */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <button
                    onClick={() => onViewDetails(order)}
                    className="text-sm font-semibold text-[#1E2A55] hover:text-[#CFAE56] transition-colors flex items-center gap-2"
                >
                    View Order Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
