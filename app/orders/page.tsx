"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Navbar from "@/components/NavBar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getUserOrders } from "@/lib/api/orders";
import type { OrderSummary } from "@/types/order";
import OrderCard from "@/components/orders/OrderCard";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";

export default function OrdersPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getUserOrders();
                if (response.success && response.data) {
                    // Sort by date descending (newest first)
                    const sortedOrders = [...response.data].sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setOrders(sortedOrders);
                } else {
                    setError(typeof response.error === 'string' ? response.error : "Failed to fetch orders");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const handleViewDetails = (order: OrderSummary) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedOrder(null), 300); // Clear after animation
    };

    const filteredOrders = statusFilter === "ALL"
        ? orders
        : orders.filter(order => order.status.toUpperCase() === statusFilter);

    const statusOptions = [
        { label: "All Orders", value: "ALL" },
        { label: "Pending", value: "PENDING" },
        { label: "Confirmed", value: "CONFIRMED" },
        { label: "Shipped", value: "SHIPPED" },
        { label: "Delivered", value: "DELIVERED" },
        { label: "Cancelled", value: "CANCELLED" },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F8F9FC]">
                <Navbar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl font-bold text-[#1E2A55] tracking-tight">My Orders</h1>
                            <p className="text-gray-500 mt-2 text-lg">
                                View and track your order history
                            </p>
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setStatusFilter(option.value)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${statusFilter === option.value
                                            ? "bg-[#1E2A55] text-white shadow-md transform scale-105"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="grid grid-cols-1 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">
                                    <div className="flex justify-between mb-6">
                                        <div className="h-8 bg-gray-100 rounded-lg w-1/3"></div>
                                        <div className="h-8 bg-gray-100 rounded-lg w-1/6"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load orders</h3>
                            <p className="text-gray-500 mb-8">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 bg-[#1E2A55] text-white rounded-full hover:bg-[#2A3A65] transition-all shadow-lg hover:shadow-xl font-semibold"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders found</h3>
                            <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg">
                                {statusFilter === "ALL"
                                    ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                                    : `You don't have any ${statusFilter.toLowerCase()} orders.`}
                            </p>
                            {statusFilter === "ALL" && (
                                <button
                                    onClick={() => router.push('/products')}
                                    className="px-10 py-4 bg-[#1E2A55] text-white rounded-full hover:bg-[#2A3A65] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 font-bold text-lg"
                                >
                                    Start Shopping
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {filteredOrders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    )}
                </main>

                <OrderDetailsModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            </div>
        </ProtectedRoute>
    );
}
