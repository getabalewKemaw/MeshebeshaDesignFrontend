import React from "react";

interface OrderStatusBadgeProps {
    status: string;
    className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className = "" }) => {
    const getStatusConfig = (status: string) => {
        const normalizedStatus = status.toUpperCase();

        switch (normalizedStatus) {
            case "PENDING":
                return {
                    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                    icon: (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    label: "Pending"
                };
            case "CONFIRMED":
                return {
                    color: "bg-blue-100 text-blue-800 border-blue-200",
                    icon: (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    label: "Confirmed"
                };
            case "SHIPPED":
                return {
                    color: "bg-purple-100 text-purple-800 border-purple-200",
                    icon: (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    ),
                    label: "Shipped"
                };
            case "DELIVERED":
                return {
                    color: "bg-green-100 text-green-800 border-green-200",
                    icon: (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ),
                    label: "Delivered"
                };
            case "CANCELLED":
                return {
                    color: "bg-red-100 text-red-800 border-red-200",
                    icon: (
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ),
                    label: "Cancelled"
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800 border-gray-200",
                    icon: null,
                    label: status
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}>
            {config.icon}
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;
