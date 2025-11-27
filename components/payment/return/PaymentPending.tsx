import Link from "next/link";
import PaymentStatusCard from "./PaymentStatusCard";

export default function PaymentPending() {
    return (
        <PaymentStatusCard variant="pending">
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
        </PaymentStatusCard>
    );
}
