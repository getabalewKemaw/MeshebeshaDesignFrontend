export default function OrdersLoadingState() {
    return (
        <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse">
                    <div className="flex justify-between mb-6">
                        <div className="h-8 bg-gray-100 rounded-lg w-1/3"></div>
                        <div className="h-8 bg-gray-100 rounded-lg w-1/6"></div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
