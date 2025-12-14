import type { ProductWithDetails, ProductVariant } from "@/types/product";
import ColorSelect from "@/components/products/ColorSelect";
interface ProductInfoProps {
    product: ProductWithDetails;
    selectedVariant: ProductVariant | null;
    currentPrice: number;
    colorOptions: string[];
    selectedColor: string | null;
    onColorChange: (color: string) => void;
    sizeOptions: string[];
    selectedSize: string | null;
    onSizeChange: (size: string) => void;
    isOutOfStock: boolean;
}
export default function ProductInfo({
    product,
    selectedVariant,
    currentPrice,
    colorOptions,
    selectedColor,
    onColorChange,
    sizeOptions,
    selectedSize,
    onSizeChange,
    isOutOfStock,
}: ProductInfoProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-end gap-3">
                <span className="text-3xl font-semibold text-[#310101]">
                    {product.currency} {currentPrice.toFixed(2)}
                </span>
                {selectedVariant?.priceOverride && (
                    <span className="text-sm text-gray-500 line-through">
                        {product.currency} {product.price.toFixed(2)}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {selectedVariant?.sku && (
                    <span>SKU: {selectedVariant.sku}</span>
                )}
                <span>
                    Stock:{" "}
                    {selectedVariant
                        ? `${selectedVariant.stock} ${selectedVariant.stock === 1 ? "unit" : "units"
                        }`
                        : "Available"}
                </span>
            </div>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {product.description || "No description."}
            </p>
            {colorOptions.length > 0 && (
                <ColorSelect
                    colors={colorOptions}
                    value={selectedColor}
                    onChange={onColorChange}
                    disabled={isOutOfStock}
                />
            )}

            {sizeOptions.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700" htmlFor="size-select">
                            Size
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                // This will be handled by parent component
                                const event = new CustomEvent('openSizeChart');
                                window.dispatchEvent(event);
                            }}
                            className="text-xs text-[#310101] hover:underline font-medium"
                        >
                            Learn more about sizes
                        </button>
                    </div>
                    <select
                        id="size-select"
                        value={selectedSize ?? ""}
                        onChange={(event) => onSizeChange(event.target.value)}
                        disabled={isOutOfStock}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#310101] focus:ring-2 focus:ring-[#310101]/20 disabled:opacity-50"
                    >
                        {sizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}


