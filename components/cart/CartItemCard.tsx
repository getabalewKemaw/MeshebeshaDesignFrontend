import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import QuantitySelector from "@/components/ui/QuantitySelector";

interface CartItemCardProps {
    item: CartItem;
    formatPrice: (price: number) => string;
    onRemove: (key: string) => void;
    onQuantityChange: (key: string, quantity: number) => void;
    showDivider?: boolean;
}

export default function CartItemCard({
    item,
    formatPrice,
    onRemove,
    onQuantityChange,
    showDivider = false,
}: CartItemCardProps) {
    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                {/* Product Image - Clickable with Black Border */}
                <Link
                    href={`/products/${item.productId}`}
                    className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg overflow-hidden hover:opacity-80 transition-opacity border border-black"
                >
                    {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No image
                        </div>
                    )}
                </Link>

                {/* Item Details */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Link
                                href={`/products/${item.productId}`}
                                className="hover:text-purple-600 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {item.title}
                                </h2>
                            </Link>
                            <p className="text-sm text-gray-500">
                                {item.color && <span>{item.color}</span>}
                                {item.size && (
                                    <span className="ml-1">
                                        {item.color ? "/" : ""}
                                        {item.size}
                                    </span>
                                )}
                            </p>
                            {item.subtitle && (
                                <p className="text-xs text-gray-400">SKU: {item.subtitle}</p>
                            )}
                        </div>

                        {/* Remove Button with Icon */}
                        <button
                            type="button"
                            onClick={() => onRemove(item.key)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            aria-label={`Remove ${item.title}`}
                            title="Remove item"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>

                    {/* Quantity Controls and Price */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <QuantitySelector
                            quantity={item.quantity}
                            onQuantityChange={(qty) => onQuantityChange(item.key, qty)}
                            max={typeof item.stock === "number" && item.stock > 0 ? item.stock : undefined}
                        />

                        <div className="text-right">
                            <p className="text-sm text-gray-500">
                                Unit price: {formatPrice(item.unitPrice)}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {formatPrice(item.unitPrice * item.quantity)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider - Thin Black Line */}
            {showDivider && <div className="h-px bg-black my-4" />}
        </>
    );
}
