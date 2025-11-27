import { useState, useEffect, useRef } from "react";
import { getOrderPayments } from "@/lib/api/payments";
import type { PaymentStatus } from "@/lib/api/payments";

interface UsePaymentStatusResult {
    paymentStatus: PaymentStatus | null;
    isLoading: boolean;
    error: string | null;
}

export function usePaymentStatus(orderId: string | null): UsePaymentStatusResult {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use refs to track state inside intervals/timeouts without dependencies issues
    const shouldStopPollingRef = useRef(false);
    const pollCountRef = useRef(0);
    const maxPollAttempts = 12; // Max 12 attempts (60 seconds / 5 seconds)

    useEffect(() => {
        if (!orderId) {
            setError("Order ID is missing");
            setIsLoading(false);
            return;
        }

        const pollPaymentStatus = async () => {
            if (shouldStopPollingRef.current) return;

            pollCountRef.current += 1;

            // Stop if we've exceeded max attempts
            if (pollCountRef.current > maxPollAttempts) {
                shouldStopPollingRef.current = true;
                setIsLoading(false);
                setPaymentStatus((prev) => {
                    if (!prev) {
                        setError("Payment status check timed out. Please check your order status.");
                    }
                    return prev;
                });
                return;
            }

            try {
                const response = await getOrderPayments(orderId);
                if (response.success && response.data && response.data.length > 0) {
                    const latestPayment = response.data[0]; // Most recent payment
                    setPaymentStatus(latestPayment);

                    // If payment is paid or failed, stop polling immediately
                    if (latestPayment.status === "paid" || latestPayment.status === "failed") {
                        shouldStopPollingRef.current = true;
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : "An unexpected error occurred";
                console.error("Error fetching payment status:", err);

                // For errors, continue polling but log them unless max attempts reached
                if (pollCountRef.current >= maxPollAttempts) {
                    setError(msg);
                }
            }
        };

        // Initial fetch
        pollPaymentStatus();

        // Poll every 5 seconds
        const pollInterval = setInterval(() => {
            if (!shouldStopPollingRef.current) {
                pollPaymentStatus();
            } else {
                clearInterval(pollInterval);
            }
        }, 5000);

        // Global timeout safety net (60 seconds)
        const timeout = setTimeout(() => {
            shouldStopPollingRef.current = true;
            clearInterval(pollInterval);
            setIsLoading(false);
            setPaymentStatus((prev) => {
                if (!prev) {
                    setError("Payment status check timed out. Please check your order status.");
                }
                return prev;
            });
        }, 60000);

        return () => {
            shouldStopPollingRef.current = true;
            clearInterval(pollInterval);
            clearTimeout(timeout);
        };
    }, [orderId]);

    return { paymentStatus, isLoading, error };
}
