interface OrdersErrorStateProps {
    error: string;
    onRetry: () => void;
}

export default function OrdersErrorState({ error, onRetry }: OrdersErrorStateProps) {
    return (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load orders</h3>
            <p className="text-gray-500 mb-8">{error}</p>
            <button
                onClick={onRetry}
                className="px-8 py-3 bg-[#1E2A55] text-white rounded-full hover:bg-[#2A3A65] transition-all shadow-lg hover:shadow-xl font-semibold"
            >
                Try Again
            </button>
        </div>
    );
}
