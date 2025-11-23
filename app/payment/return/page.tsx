"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/NavBar";
import { getOrderPayments } from "@/lib/api/payments";
import type { PaymentStatus } from "@/lib/api/payments";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID is missing");
      setIsLoading(false);
      return;
    }

    // Poll for payment status
    let pollCount = 0;
    const maxPollAttempts = 12; // Max 12 attempts (60 seconds / 5 seconds)
    let shouldStopPolling = false;

    const pollPaymentStatus = async () => {
      if (shouldStopPolling) return;
      
      pollCount++;
      
      // Stop if we've exceeded max attempts
      if (pollCount > maxPollAttempts) {
        shouldStopPolling = true;
        setIsLoading(false);
        if (!paymentStatus) {
          setError("Payment status check timed out. Please check your order status.");
        }
        return;
      }

      try {
        const response = await getOrderPayments(orderId);
        if (response.success && response.data && response.data.length > 0) {
          const latestPayment = response.data[0]; // Most recent payment
          setPaymentStatus(latestPayment);

          // If payment is paid or failed, stop polling immediately
          if (latestPayment.status === "paid" || latestPayment.status === "failed") {
            shouldStopPolling = true;
            setIsLoading(false);
            return;
          }
        }
      } catch (err: any) {
        console.error("Error fetching payment status:", err);
        
        // If we get a 429 error, stop polling to avoid more rate limit errors
        if (err?.response?.status === 429 || err?.status === 429) {
          console.warn("Rate limit reached, stopping polling");
          shouldStopPolling = true;
          setIsLoading(false);
          setError("Too many requests. Please refresh the page to check payment status.");
          return;
        }
        
        // For other errors, continue polling but log them
        if (pollCount >= maxPollAttempts) {
          setError("Failed to fetch payment status. Please check your order status.");
        }
      }
    };

    // Initial fetch
    pollPaymentStatus();

    // Poll every 5 seconds for up to 60 seconds (less frequent to avoid rate limits)
    const pollInterval = setInterval(() => {
      if (!shouldStopPolling) {
        pollPaymentStatus();
      } else {
        clearInterval(pollInterval);
      }
    }, 5000);
    
    const timeout = setTimeout(() => {
      shouldStopPolling = true;
      clearInterval(pollInterval);
      setIsLoading(false);
      if (!paymentStatus) {
        setError("Payment status check timed out. Please check your order status.");
      }
    }, 60000); // 60 seconds timeout

    return () => {
      shouldStopPolling = true;
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [orderId, paymentStatus]);

  if (!orderId) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h1 className="text-2xl font-semibold text-red-900 mb-2">Invalid Request</h1>
            <p className="text-red-700">Order ID is missing from the URL.</p>
            <Link
              href="/orders"
              className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h1 className="text-2xl font-semibold text-red-900 mb-2">Error</h1>
            <p className="text-red-700 mb-4">{error}</p>
            <Link
              href="/orders"
              className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (isLoading || !paymentStatus) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-semibold text-blue-900 mb-2">Processing Payment</h1>
            <p className="text-blue-700">
              Please wait while we verify your payment. This may take a few moments...
            </p>
          </div>
        </div>
      </>
    );
  }

  const isSuccess = paymentStatus.status === "paid";
  const isFailed = paymentStatus.status === "failed";

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div
          className={`border rounded-xl p-8 ${
            isSuccess
              ? "bg-green-50 border-green-200"
              : isFailed
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          {isSuccess ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-semibold text-green-900 mb-2">Payment Successful!</h1>
                <p className="text-green-700">
                  Your payment of{" "}
                  <span className="font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: paymentStatus.currency,
                    }).format(paymentStatus.amount)}
                  </span>{" "}
                  has been received.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Reference:</span>
                    <span className="font-mono text-gray-900">{paymentStatus.chapaRef || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600 capitalize">{paymentStatus.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-green-800">
                  Your order is now being processed. You will receive a confirmation email shortly.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/orders"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                  >
                    View My Orders
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </>
          ) : isFailed ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-semibold text-red-900 mb-2">Payment Failed</h1>
                <p className="text-red-700">
                  Your payment could not be processed. Please try again.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Reference:</span>
                    <span className="font-mono text-gray-900">{paymentStatus.chapaRef || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-red-600 capitalize">{paymentStatus.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-red-800">
                  If you believe this is an error, please contact support or try again.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href="/orders"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                  >
                    View My Orders
                  </Link>
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                </div>
                <h1 className="text-3xl font-semibold text-yellow-900 mb-2">Payment Pending</h1>
                <p className="text-yellow-700">Your payment is still being processed.</p>
              </div>
              <div className="text-center">
                <Link
                  href="/orders"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  View My Orders
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}


