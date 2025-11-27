interface OrdersHeaderProps {
    statusFilter: string;
    setStatusFilter: (status: string) => void;
}

export default function OrdersHeader({ statusFilter, setStatusFilter }: OrdersHeaderProps) {
    const statusOptions = [
        { label: "All Orders", value: "ALL" },
        { label: "Pending", value: "PENDING" },
        { label: "Confirmed", value: "CONFIRMED" },
        { label: "Shipped", value: "SHIPPED" },
        { label: "Delivered", value: "DELIVERED" },
        { label: "Cancelled", value: "CANCELLED" },
    ];

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
                <h1 className="text-4xl font-bold text-[#1E2A55] tracking-tight">My Orders</h1>
                <p className="text-gray-500 mt-2 text-lg">
                    View and track your order history
                </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${statusFilter === option.value
                            ? "bg-[#1E2A55] text-white shadow-md transform scale-105"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
