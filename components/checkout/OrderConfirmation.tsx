import type { OrderSummary } from "@/types/order";

interface OrderConfirmationProps {
    orderSummary: OrderSummary;
    formatPrice: (price: number) => string;
}

export default function OrderConfirmation({ orderSummary, formatPrice }: OrderConfirmationProps) {
    return (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-purple-900">
                Order #{orderSummary.orderNumber}
            </p>
            <p className="text-xs text-purple-700 mt-1">
                Total: {formatPrice(orderSummary.total)}
            </p>
        </div>
    );
}
