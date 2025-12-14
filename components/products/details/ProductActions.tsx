import QuantitySelector from "@/components/ui/QuantitySelector";
import { ShoppingCart, Zap, CreditCard } from "lucide-react";
import type { ProductVariant } from "@/types/product";

interface ProductActionsProps {
    quantity: number;
    onQuantityChange: (qty: number) => void;
    selectedVariant: ProductVariant | null;
    isOutOfStock: boolean;
    isBuyingNow: boolean;
    isAdding: boolean;
    sizeOptionsLength: number;
    selectedSize: string | null;
    variantsLength: number;
    onBuyNow: () => void;
    onAddToCart: () => void;
    onBuyWithChapa: () => void;
    onMorePaymentOptions: () => void;
    feedback: string | null;
}

export default function ProductActions({
    quantity,
    onQuantityChange,
    selectedVariant,
    isOutOfStock,
    isBuyingNow,
    isAdding,
    sizeOptionsLength,
    selectedSize,
    variantsLength,
    onBuyNow,
    onAddToCart,
    onBuyWithChapa,
    onMorePaymentOptions,
    feedback,
}: ProductActionsProps) {
    const isDisabled = isOutOfStock || (sizeOptionsLength > 0 && !selectedSize);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={onQuantityChange}
                    max={selectedVariant?.stock && selectedVariant.stock > 0 ? selectedVariant.stock : undefined}
                />
                {typeof selectedVariant?.stock === "number" && selectedVariant.stock > 0 && (
                    <span className="text-xs text-gray-500">
                        {selectedVariant.stock} available
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                {/* Add to Cart Button */}
                <button
                    type="button"
                    onClick={onAddToCart}
                    disabled={isDisabled || isAdding}
                    className="w-full bg-[#310101] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a0202] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isAdding ? (
                        "Adding..."
                    ) : (
                        <>
                            <ShoppingCart size={18} />
                            Add to cart
                        </>
                    )}
                </button>

                {/* Buy with Chapa Button */}
                <button
                    type="button"
                    onClick={onBuyWithChapa}
                    disabled={isDisabled || isBuyingNow}
                    className="w-full bg-[#310101] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a0202] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isBuyingNow ? (
                        "Processing..."
                    ) : (
                        <>
                            Buy with <span className="text-green-400">Chapa</span>
                        </>
                    )}
                </button>

                {/* More Payment Options Button */}
                <button
                    type="button"
                    onClick={onMorePaymentOptions}
                    disabled={isDisabled}
                    className="w-full bg-[#310101] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a0202] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <CreditCard size={18} />
                    More Payment option
                </button>

                {/* Feedback Messages */}
                <div className="text-sm text-center">
                    {feedback && (
                        <span className="text-green-600 font-medium">{feedback}</span>
                    )}
                    {!feedback && !isOutOfStock && (
                        <span className="text-gray-500">
                            Ready to ship within 2 business days
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="text-gray-500">
                            We'll notify you when it's back in stock
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
