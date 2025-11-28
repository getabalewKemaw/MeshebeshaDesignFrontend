import QuantitySelector from "@/components/ui/QuantitySelector";
import { ShoppingCart, Zap } from "lucide-react";
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
    feedback,
}: ProductActionsProps) {
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
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Buy Now Button - Primary CTA */}
                    <button
                        type="button"
                        onClick={onBuyNow}
                        disabled={
                            isOutOfStock ||
                            isBuyingNow ||
                            (sizeOptionsLength > 0 && !selectedSize)
                        }
                        className="form-button-primary flex-1 gap-2"
                    >
                        {isOutOfStock
                            ? "Out of Stock"
                            : isBuyingNow
                                ? "Processing..."
                                : (
                                    <>
                                        <Zap size={18} />
                                        Buy Now
                                    </>
                                )}
                    </button>

                    {/* Add to Cart Button - Secondary CTA */}
                    <button
                        type="button"
                        onClick={onAddToCart}
                        disabled={
                            isOutOfStock ||
                            isAdding ||
                            (sizeOptionsLength > 0 && !selectedSize)
                        }
                        className="form-button-secondary flex-1 gap-2"
                    >
                        {isAdding ? (
                            "Adding..."
                        ) : (
                            <>
                                <ShoppingCart size={18} />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>

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
