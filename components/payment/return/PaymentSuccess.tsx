import Link from "next/link";
import type { PaymentStatus } from "@/lib/api/payments";
import PaymentStatusCard from "./PaymentStatusCard";

interface PaymentSuccessProps {
    paymentStatus: PaymentStatus;
}

export default function PaymentSuccess({ paymentStatus }: PaymentSuccessProps) {
    return (
        <PaymentStatusCard variant="success">
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
        </PaymentStatusCard>
    );
}
