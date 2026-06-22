import Link from "next/link";
import PaymentStatusCard from "./PaymentStatusCard";

interface PaymentPendingProps {
    isStillPolling?: boolean;
    pollCount?: number;
    onRetry?: () => void;
}

export default function PaymentPending({
    isStillPolling = false,
    pollCount = 0,
    onRetry,
}: PaymentPendingProps) {
    // Determine which stage we're in for user feedback
    const isVerifying = pollCount > 6;
    const hasTimedOut = !isStillPolling && pollCount > 0;

    return (
        <PaymentStatusCard variant="pending">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {isStillPolling ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                    ) : (
                        <svg
                            className="w-8 h-8 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                </div>

                <h1 className="text-3xl font-semibold text-yellow-900 mb-2">
                    {hasTimedOut ? "Payment Status Unknown" : "Payment Pending"}
                </h1>

                <p className="text-yellow-700 mb-1">
                    {isStillPolling && !isVerifying &&
                        "Waiting for payment confirmation..."}
                    {isStillPolling && isVerifying &&
                        "Verifying payment with Chapa..."}
                    {hasTimedOut &&
                        "We couldn't confirm your payment automatically. If you completed the payment, click the button below."}
                </p>

                {isStillPolling && (
                    <p className="text-yellow-500 text-sm mt-2">
                        This usually takes a few seconds. Please don&apos;t close this page.
                    </p>
                )}
            </div>

            <div className="flex flex-col items-center gap-3">
                {/* Show retry button when polling has stopped or is taking too long */}
                {(hasTimedOut || isVerifying) && onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Check Again
                    </button>
                )}

                <Link
                    href="/orders"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                >
                    View My Orders
                </Link>
            </div>
        </PaymentStatusCard>
    );
}
