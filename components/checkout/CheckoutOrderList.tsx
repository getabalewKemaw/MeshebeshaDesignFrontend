import CheckoutOrderItem from "./CheckoutOrderItem";
import type { CartItem } from "@/types/cart";

interface CheckoutOrderListProps {
    items: CartItem[];
    formatPrice: (price: number) => string;
}

export default function CheckoutOrderList({ items, formatPrice }: CheckoutOrderListProps) {
    return (
        <div className="space-y-0 max-h-96 overflow-y-auto">
            {items.map((item, index) => (
                <div key={item.key}>
                    <div className="py-4">
                        <CheckoutOrderItem
                            item={item}
                            formatPrice={formatPrice}
                        />
                    </div>
                    {index < items.length - 1 && (
                        <div className="h-px bg-[#310101]"></div>
                    )}
                </div>
            ))}
        </div>
    );
}
