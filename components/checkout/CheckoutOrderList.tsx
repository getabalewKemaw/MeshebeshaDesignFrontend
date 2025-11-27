import CheckoutOrderItem from "./CheckoutOrderItem";
import type { CartItem } from "@/types/cart";

interface CheckoutOrderListProps {
    items: CartItem[];
    formatPrice: (price: number) => string;
}

export default function CheckoutOrderList({ items, formatPrice }: CheckoutOrderListProps) {
    return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.map((item) => (
                <CheckoutOrderItem
                    key={item.key}
                    item={item}
                    formatPrice={formatPrice}
                />
            ))}
        </div>
    );
}
