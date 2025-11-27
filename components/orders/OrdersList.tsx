import type { OrderSummary } from "@/types/order";
import OrderCard from "./OrderCard";

interface OrdersListProps {
    orders: OrderSummary[];
    onViewDetails: (order: OrderSummary) => void;
}

export default function OrdersList({ orders, onViewDetails }: OrdersListProps) {
    return (
        <div className="grid grid-cols-1 gap-8">
            {orders.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
}
