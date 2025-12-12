import React, { useEffect } from "react";
import Image from "next/image";
import type { OrderSummary } from "@/types/order";
import { formatCurrency, formatDateTime } from "@/lib/utils/product-utils";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrderDetailsModalProps {
    order: OrderSummary | null;
    isOpen: boolean;
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const items = order.items || [];
    const shippingInfo = order.shippingInfo;
    const contact = shippingInfo?.contact;
    const address = shippingInfo?.address;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal Panel */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
                <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-3xl flex flex-col max-h-[90vh]">

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div>
                            <h3 className="text-xl font-bold text-[#310101]" id="modal-title">
                                Order Details
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                #{order.orderNumber || order.id}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 overflow-y-auto custom-scrollbar flex-grow">

                        {/* Status & Date */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <OrderStatusBadge status={order.status} />
                                <span className="text-sm text-gray-500">
                                    {formatDateTime(order.createdAt)}
                                </span>
                            </div>
                            <div className="text-xl font-bold text-[#310101]">
                                {formatCurrency(order.total, order.currency)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Shipping Info */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3">Shipping Address</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    {contact && (
                                        <p className="font-medium text-gray-900">{contact.fullName}</p>
                                    )}
                                    {address ? (
                                        <>
                                            <p>{address.line1}</p>
                                            {address.line2 && <p>{address.line2}</p>}
                                            <p>{address.city}, {address.state} {address.postalCode}</p>
                                            <p>{address.country}</p>
                                        </>
                                    ) : (
                                        <p className="italic text-gray-500">No address provided</p>
                                    )}
                                    {contact && (
                                        <div className="pt-2 mt-2 border-t border-gray-100">
                                            <p>{contact.email}</p>
                                            {contact.phone && <p>{contact.phone}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3">Payment</h4>
                                <div className="text-sm text-gray-600 space-y-3">
                                    {order.payments && order.payments.length > 0 ? (
                                        order.payments.map((payment, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <span className="capitalize font-medium text-gray-900">{payment.provider}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="italic text-gray-500">No payment details</p>
                                    )}

                                    <div className="pt-3 border-t border-gray-100 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(order.total, order.currency)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span className="font-medium text-green-600">Free</span>
                                        </div>
                                        <div className="flex justify-between pt-2 mt-2 border-t border-gray-100 font-bold text-[#310101]">
                                            <span>Total</span>
                                            <span>{formatCurrency(order.total, order.currency)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100 mb-8"></div>

                        {/* Items */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-4">Items ({items.length})</h4>
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden relative flex-shrink-0">
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
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-medium text-gray-900 truncate">
                                                {item.title || item.product?.title || "Product"}
                                            </h5>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {item.size && <span className="mr-3">Size: {item.size}</span>}
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(item.unitPrice * item.quantity, order.currency)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-semibold text-[#310101] hover:text-[#500202] transition-colors flex items-center gap-2"
                            onClick={() => window.print()}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
