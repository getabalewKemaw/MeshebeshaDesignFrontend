import { useRouter } from "next/navigation";

interface OrdersEmptyStateProps {
    statusFilter: string;
}

export default function OrdersEmptyState({ statusFilter }: OrdersEmptyStateProps) {
    const router = useRouter();

    return (
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
    );
}
