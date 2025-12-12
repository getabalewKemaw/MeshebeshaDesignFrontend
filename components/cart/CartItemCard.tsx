import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import type { CartItem } from "@/types/cart";

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
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto] gap-4 md:gap-6 items-center py-6">
                {/* Product Image and Info */}
                <div className="flex items-start gap-4 md:col-span-2">
                    <Link
                        href={`/products/${item.productId}`}
                        className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden hover:opacity-80 transition-opacity flex-shrink-0"
                    >
                        {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No image
                            </div>
                        )}
                    </Link>

                    <div className="flex-1 min-w-0">
                        <Link
                            href={`/products/${item.productId}`}
                            className="hover:text-[#310101] transition-colors"
                        >
                            <h2 className="text-base font-medium text-gray-900 line-clamp-2">
                                {item.title}
                            </h2>
                        </Link>
                        <div className="mt-1 space-y-0.5">
                            <p className="text-sm text-gray-600">
                                {formatPrice(item.unitPrice)}
                            </p>
                            {item.size && (
                                <p className="text-xs text-gray-500">
                                    Size: {item.size}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between md:justify-start gap-4">
                    <div className="flex items-center gap-2 border border-gray-300 rounded-md">
                        <button
                            type="button"
                            onClick={() => onQuantityChange(item.key, Math.max(1, item.quantity - 1))}
                            className="px-3 py-2 hover:bg-gray-50 transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="min-w-[2rem] text-center font-medium text-gray-900">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => onQuantityChange(item.key, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-50 transition-colors"
                            aria-label="Increase quantity"
                            disabled={typeof item.stock === "number" && item.stock > 0 && item.quantity >= item.stock}
                        >
                            <Plus size={16} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Mobile: Show total and remove on same row */}
                    <div className="flex items-center gap-4 md:hidden">
                        <div className="font-semibold text-gray-900">
                            {formatPrice(item.unitPrice * item.quantity)}
                        </div>
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
                </div>

                {/* Desktop: Total Price */}
                <div className="hidden md:flex items-center justify-end gap-4">
                    <div className="text-right font-semibold text-gray-900 min-w-[100px]">
                        {formatPrice(item.unitPrice * item.quantity)}
                    </div>

                    {/* Remove Button */}
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
            </div>

            {/* Divider */}
            {showDivider && <div className="h-px bg-[#310101]" />}
        </>
    );
}
