interface OrderItem {
    variantId?: string;
    title: string;
    quantity: number;
    size?: string | null;
    unitPrice: number;
    product?: {
        title?: string;
    };
}

interface OrderItemsListProps {
    items: OrderItem[];
    currencyFormatter: Intl.NumberFormat;
}

export default function OrderItemsList({ items, currencyFormatter }: OrderItemsListProps) {
    return (
        <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Order Items</p>
                <span className="text-xs text-gray-500">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                    <div
                        key={item.variantId || index}
                        className="rounded-xl border border-gray-100 p-3 text-sm bg-gray-50"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 mb-1">
                                    {item.title}
                                </div>
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div>
                                        Quantity: <span className="font-medium">{item.quantity}</span>
                                    </div>
                                    {item.size && (
                                        <div>
                                            Size: <span className="font-medium">{item.size}</span>
                                        </div>
                                    )}
                                    {item.product?.title && (
                                        <div className="text-gray-400">
                                            Product: {item.product.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                    {currencyFormatter.format(item.unitPrice * item.quantity)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {currencyFormatter.format(item.unitPrice)} each
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
