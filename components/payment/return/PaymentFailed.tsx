import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PaymentStatus } from "@/lib/api/payments";
import PaymentStatusCard from "./PaymentStatusCard";

interface PaymentFailedProps {
    paymentStatus: PaymentStatus;
}

export default function PaymentFailed({ paymentStatus }: PaymentFailedProps) {
    const router = useRouter();

    return (
        <PaymentStatusCard variant="failed">
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
        </PaymentStatusCard>
    );
}
