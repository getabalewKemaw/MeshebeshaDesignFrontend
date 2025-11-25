import Link from "next/link";

interface OrderSummaryCardProps {
    itemCount: number;
    subtotal: number;
    formatPrice: (price: number) => string;
    ctaLabel?: string;
    ctaHref?: string;
    helperText?: string;
}

export default function OrderSummaryCard({
    itemCount,
    subtotal,
    formatPrice,
    ctaLabel = "Continue to checkout",
    ctaHref = "/checkout",
    helperText = "Need to edit your cart later? Items are saved on this device.",
}: OrderSummaryCardProps) {
    return (
        <div className="border border-gray-200 rounded-xl p-6 bg-white h-fit space-y-4 lg:sticky lg:top-4">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                <p className="text-sm text-gray-500">
                    Taxes and shipping calculated at checkout.
                </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Items ({itemCount})</span>
                <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="space-y-3 pt-2">
                <Link
                    href={ctaHref}
                    className="form-button-primary w-full"
                >
                    {ctaLabel}
                </Link>
                {helperText && (
                    <p className="text-xs text-gray-500 text-center">{helperText}</p>
                )}
            </div>
        </div>
    );
}
