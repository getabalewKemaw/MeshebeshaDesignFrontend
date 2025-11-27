import Link from "next/link";
import PaymentStatusCard from "./PaymentStatusCard";

interface PaymentErrorProps {
    message: string;
    title?: string;
}

export default function PaymentError({ message, title = "Error" }: PaymentErrorProps) {
    return (
        <PaymentStatusCard variant="error">
            <h1 className="text-2xl font-semibold text-red-900 mb-2">{title}</h1>
            <p className="text-red-700 mb-4">{message}</p>
            <Link
                href="/orders"
                className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium"
            >
                View My Orders
            </Link>
        </PaymentStatusCard>
    );
}
