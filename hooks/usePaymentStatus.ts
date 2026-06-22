import { useState, useEffect, useRef, useCallback } from "react";
import { getOrderPayments, verifyPaymentStatus } from "@/lib/api/payments";
import type { PaymentStatus } from "@/lib/api/payments";

interface UsePaymentStatusResult {
    paymentStatus: PaymentStatus | null;
    isLoading: boolean;
    error: string | null;
    /** Manually trigger a fresh verification with Chapa */
    retryVerification: () => void;
    /** Number of poll attempts so far */
    pollCount: number;
}

/**
 * Smart payment status hook with active Chapa verification fallback.
 *
 * Strategy:
 * 1. Poll DB every 3s for the first 30s (fast check — webhook may have arrived)
 * 2. After 30s still pending → trigger active Chapa verification (bypasses webhook)
 * 3. Continue polling every 5s with periodic re-verification up to 3 minutes
 * 4. After 3 minutes → stop but allow manual "Check Again"
 */
export function usePaymentStatus(orderId: string | null): UsePaymentStatusResult {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);

    const shouldStopPollingRef = useRef(false);
    const pollCountRef = useRef(0);
    const hasTriggeredVerifyRef = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Phase thresholds
    const FAST_POLL_INTERVAL = 3000;     // 3s during fast phase
    const SLOW_POLL_INTERVAL = 5000;     // 5s during slow phase
    const FAST_PHASE_POLLS = 10;         // First 10 polls = ~30s of fast polling
    const VERIFY_AFTER_POLLS = 6;        // Trigger active verify after ~18s
    const RE_VERIFY_EVERY_POLLS = 8;     // Re-verify with Chapa every ~40s
    const MAX_POLL_ATTEMPTS = 40;        // ~3 minutes total
    const GLOBAL_TIMEOUT = 180000;       // 3 minute hard cutoff

    /**
     * Call Chapa verify API directly to check if payment succeeded
     * even if the webhook never arrived (stale ngrok, etc.)
     */
    const triggerActiveVerification = useCallback(async () => {
        if (!orderId || shouldStopPollingRef.current) return;

        try {
            console.log("[PaymentStatus] 🔍 Triggering active Chapa verification for order:", orderId);
            const response = await verifyPaymentStatus(orderId);

            if (response.success && response.data) {
                const { status, payment } = response.data;

                if (status === "paid" && payment) {
                    console.log("[PaymentStatus] ✅ Active verification confirmed PAID!");
                    setPaymentStatus(payment as unknown as PaymentStatus);
                    shouldStopPollingRef.current = true;
                    setIsLoading(false);
                    return;
                }

                if (status === "failed" && payment) {
                    console.log("[PaymentStatus] ❌ Active verification confirmed FAILED");
                    setPaymentStatus(payment as unknown as PaymentStatus);
                    shouldStopPollingRef.current = true;
                    setIsLoading(false);
                    return;
                }

                console.log("[PaymentStatus] ⏳ Active verification: still pending at Chapa");
            }
        } catch (err) {
            console.error("[PaymentStatus] Active verification error:", err);
            // Don't fail — keep polling
        }
    }, [orderId]);

    /**
     * Standard DB poll — check if webhook has updated the payment
     */
    const pollPaymentStatus = useCallback(async () => {
        if (!orderId || shouldStopPollingRef.current) return;

        pollCountRef.current += 1;
        setPollCount(pollCountRef.current);

        // Stop if we've exceeded max attempts
        if (pollCountRef.current > MAX_POLL_ATTEMPTS) {
            shouldStopPollingRef.current = true;
            setIsLoading(false);
            // Do one final active verification before giving up
            await triggerActiveVerification();
            return;
        }

        try {
            const response = await getOrderPayments(orderId);
            if (response.success && response.data && response.data.length > 0) {
                const latestPayment = response.data[0];
                setPaymentStatus(latestPayment);

                if (latestPayment.status === "paid" || latestPayment.status === "failed") {
                    shouldStopPollingRef.current = true;
                    setIsLoading(false);
                    return;
                }
            }
        } catch (err: unknown) {
            console.error("[PaymentStatus] Poll error:", err);
        }

        // After VERIFY_AFTER_POLLS polls, trigger active verification as fallback
        if (
            pollCountRef.current >= VERIFY_AFTER_POLLS &&
            !hasTriggeredVerifyRef.current
        ) {
            hasTriggeredVerifyRef.current = true;
            await triggerActiveVerification();
        }

        // Periodically re-verify with Chapa
        if (
            pollCountRef.current > VERIFY_AFTER_POLLS &&
            pollCountRef.current % RE_VERIFY_EVERY_POLLS === 0
        ) {
            await triggerActiveVerification();
        }
    }, [orderId, triggerActiveVerification]);

    /**
     * Manual retry — user clicks "Check Again"
     */
    const retryVerification = useCallback(() => {
        if (!orderId) return;

        // Reset state for retry
        shouldStopPollingRef.current = false;
        hasTriggeredVerifyRef.current = false;
        pollCountRef.current = 0;
        setPollCount(0);
        setIsLoading(true);
        setError(null);

        // Immediately trigger active verification
        triggerActiveVerification();

        // Restart polling
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        pollPaymentStatus();

        intervalRef.current = setInterval(() => {
            if (!shouldStopPollingRef.current) {
                pollPaymentStatus();
            } else if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }, SLOW_POLL_INTERVAL);

        timeoutRef.current = setTimeout(() => {
            shouldStopPollingRef.current = true;
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsLoading(false);
        }, GLOBAL_TIMEOUT);
    }, [orderId, pollPaymentStatus, triggerActiveVerification]);

    useEffect(() => {
        if (!orderId) {
            setError("Order ID is missing");
            setIsLoading(false);
            return;
        }

        // Reset refs on mount
        shouldStopPollingRef.current = false;
        hasTriggeredVerifyRef.current = false;
        pollCountRef.current = 0;

        // Initial fetch
        pollPaymentStatus();

        // Start with fast polling, switch to slow after FAST_PHASE_POLLS
        let currentInterval = FAST_POLL_INTERVAL;

        intervalRef.current = setInterval(() => {
            if (!shouldStopPollingRef.current) {
                pollPaymentStatus();

                // Switch to slower polling after fast phase
                if (
                    pollCountRef.current >= FAST_PHASE_POLLS &&
                    currentInterval === FAST_POLL_INTERVAL
                ) {
                    currentInterval = SLOW_POLL_INTERVAL;
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    intervalRef.current = setInterval(() => {
                        if (!shouldStopPollingRef.current) {
                            pollPaymentStatus();
                        } else if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                    }, SLOW_POLL_INTERVAL);
                }
            } else if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }, currentInterval);

        // Global timeout safety net
        timeoutRef.current = setTimeout(() => {
            shouldStopPollingRef.current = true;
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsLoading(false);
        }, GLOBAL_TIMEOUT);

        return () => {
            shouldStopPollingRef.current = true;
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

    return { paymentStatus, isLoading, error, retryVerification, pollCount };
}
