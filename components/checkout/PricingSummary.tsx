interface PricingSummaryProps {
    subtotal: number;
    itemCount: number;
    formatPrice: (price: number) => string;
    deliverySpeed?: "standard" | "express";
}

export default function PricingSummary({ subtotal, itemCount, formatPrice, deliverySpeed }: PricingSummaryProps) {
    return (
        <div className="border-t border-gray-200 pt-4 space-y-0">
            <div className="flex items-center justify-between text-sm text-gray-600 py-2">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="h-px bg-[#310101]"></div>
            <div className="flex items-center justify-between text-sm text-gray-600 py-2">
                <span>Shipping</span>
                <span>
                    {deliverySpeed === "express" ? "Calculated at dispatch" : "Free"}
                </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between text-base font-semibold text-gray-900 pt-2">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
            </div>
        </div>
    );
}
