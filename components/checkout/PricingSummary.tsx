interface PricingSummaryProps {
    subtotal: number;
    itemCount: number;
    formatPrice: (price: number) => string;
}

export default function PricingSummary({ subtotal, itemCount, formatPrice }: PricingSummaryProps) {
    return (
        <>
            {/* Divider */}
            <div className="h-px bg-black" />

            {/* Pricing */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Calculated at next step</span>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-black" />

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
            </div>
        </>
    );
}
