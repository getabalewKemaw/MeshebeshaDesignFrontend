import type { ProductVariant, ProductWithDetails } from "@/types/product";

interface ProductVariantsListProps {
    variants: ProductVariant[];
    selectedVariantId: string | undefined;
    currency: string;
}

export default function ProductVariantsList({ variants, selectedVariantId, currency }: ProductVariantsListProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">All Variants</h2>
            {variants.length === 0 ? (
                <p className="text-sm text-gray-500">
                    This product does not have additional variants.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {variants.map((variant) => {
                        const isActive = selectedVariantId === variant.id;
                        return (
                            <div
                                key={variant.id}
                                className={`border rounded-lg p-4 bg-white transition ${isActive
                                    ? "border-[#310101] ring-2 ring-[#310101]/20"
                                    : "border-gray-200 hover:border-[#310101]/40"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">
                                        {variant.color || variant.sku || "Variant"}
                                    </span>
                                    {variant.priceOverride ? (
                                        <span className="text-sm text-[#310101] font-semibold">
                                            {currency}{" "}
                                            {variant.priceOverride.toFixed(2)}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            Default price
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                    {variant.availableSizes &&
                                        variant.availableSizes.length > 0 && (
                                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                                                Sizes: {variant.availableSizes.join(", ")}
                                            </span>
                                        )}
                                    {variant.color && (
                                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                                            Color: {variant.color}
                                        </span>
                                    )}
                                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                                        Stock: {variant.stock}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
