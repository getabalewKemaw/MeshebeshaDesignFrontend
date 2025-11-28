const STATUS_BADGE_STYLES: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-indigo-100 text-indigo-700",
    shipped: "bg-cyan-100 text-cyan-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
};

const statusLabel = (status: string) =>
    status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface Order {
    id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    total: number;
    currency: string;
    user?: {
        name?: string;
        email?: string;
    } | null;
}

interface OrderListItemProps {
    order: Order;
    isSelected: boolean;
    isViewing: boolean;
    isChecked: boolean;
    onView: (orderId: string) => void;
    onToggleCheck: (orderId: string) => void;
}

export default function OrderListItem({
    order,
    isSelected,
    isViewing,
    isChecked,
    onView,
    onToggleCheck,
}: OrderListItemProps) {
    return (
        <li
            className={`px-4 sm:px-6 py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between ${isViewing
                    ? "bg-gray-50 ring-2 ring-inset ring-black"
                    : isChecked
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                } transition-colors`}
        >
            <div className="flex items-center gap-3 flex-1">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggleCheck(order.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-black rounded-none border-gray-300 focus:ring-black"
                />
                <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onView(order.id)}
                >
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">
                            {order.orderNumber}
                        </span>
                        <span>•</span>
                        <span>
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="text-sm text-gray-600">
                        {order.user?.name ?? "Unknown customer"}
                        {order.user?.email ? ` • ${order.user.email}` : ""}
                    </div>
                    <div className="text-base font-semibold text-gray-900 mt-1">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: order.currency,
                        }).format(order.total)}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span
                    className={`px-3 py-1 text-xs font-semibold ${STATUS_BADGE_STYLES[order.status] || "bg-gray-100 text-gray-600"
                        }`}
                >
                    {statusLabel(order.status)}
                </span>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(order.id);
                    }}
                    className={`text-sm font-semibold ${isViewing
                            ? "text-black"
                            : "text-gray-600 hover:text-black"
                        }`}
                >
                    {isViewing ? "Viewing" : "View"}
                </button>
            </div>
        </li>
    );
}
