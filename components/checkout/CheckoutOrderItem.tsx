import Link from "next/link";
import Image from "next/image";
import type { CartItem } from "@/types/cart";

interface CheckoutOrderItemProps {
    item: CartItem;
    formatPrice: (price: number) => string;
}

export default function CheckoutOrderItem({
    item,
    formatPrice,
}: CheckoutOrderItemProps) {
    return (
        <div className="flex items-start gap-3">
            {/* Product Image - Clickable with Black Border */}
            <Link
                href={`/products/${item.productId}`}
                className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 hover:opacity-80 transition-opacity flex-shrink-0 border border-black"
            >
                {item.image ? (
                    <Image
                        width={64}
                        height={64}
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                    </div>
                )}
            </Link>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
                <Link
                    href={`/products/${item.productId}`}
                    className="hover:text-purple-600 transition-colors"
                >
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                    </p>
                </Link>
                <p className="text-xs text-gray-500">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
                {(item.color || item.size) && (
                    <p className="text-xs text-gray-400">
                        {item.color}
                        {item.color && item.size ? " / " : ""}
                        {item.size}
                    </p>
                )}
            </div>

            {/* Price */}
            <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                {formatPrice(item.unitPrice * item.quantity)}
            </p>
        </div>
    );
}
