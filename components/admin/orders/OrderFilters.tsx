import { Search } from "lucide-react";

const STATUS_OPTIONS = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
] as const;

interface OrderFiltersProps {
    searchTerm: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onReset: () => void;
}

export default function OrderFilters({
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusChange,
    onReset,
}: OrderFiltersProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order number or customer"
                        value={searchTerm}
                        onChange={(event) => onSearchChange(event.target.value)}
                        className="form-input-base pl-10"
                    />
                </div>
                <button
                    type="button"
                    onClick={onReset}
                    className="form-button-secondary text-sm"
                >
                    Reset
                </button>
            </div>
            <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onStatusChange(option.value)}
                        className={`px-3 py-1.5 text-sm font-medium transition-colors ${statusFilter === option.value
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
