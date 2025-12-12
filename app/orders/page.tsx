"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Navbar from "@/components/NavBar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getUserOrders } from "@/lib/api/orders";
import type { OrderSummary } from "@/types/order";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";
import OrdersHeader from "@/components/orders/OrdersHeader";
import OrdersLoadingState from "@/components/orders/OrdersLoadingState";
import OrdersErrorState from "@/components/orders/OrdersErrorState";
import OrdersEmptyState from "@/components/orders/OrdersEmptyState";
import OrdersList from "@/components/orders/OrdersList";
import NewNavBar from "@/components/newlanding/NewNavBar";

export default function OrdersPage() {
    const { isAuthenticated } = useAuth();
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

    // if the user logout or it not authenticatd then  set the orders to the  empty  data.
    useEffect(() => {
        if (!isAuthenticated) {
            setOrders([]);
            setError(null);
        }
    }, [isAuthenticated]);

    // memoized callbacks  to prevent child re renders.
    const handleViewDetails = useCallback((order: OrderSummary) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedOrder(null), 300);
    }, []);



    const filteredOrders = statusFilter === "ALL"
        ? orders
        : orders.filter(order => order.status.toUpperCase() === statusFilter);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F8F9FC]">
                <NewNavBar />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 py-10 sm:py-16">
                    <OrdersHeader
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />

                    {/* Content */}
                    {loading ? (
                        <OrdersLoadingState />
                    ) : error ? (
                        <OrdersErrorState
                            error={error}
                            onRetry={() => window.location.reload()}
                        />
                    ) : filteredOrders.length === 0 ? (
                        <OrdersEmptyState statusFilter={statusFilter} />
                    ) : (
                        <OrdersList
                            orders={filteredOrders}
                            onViewDetails={handleViewDetails}
                        />
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
