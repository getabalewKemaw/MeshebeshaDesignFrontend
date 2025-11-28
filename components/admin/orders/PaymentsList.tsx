interface Payment {
    id: string;
    provider: string;
    status: string;
    amount: number;
    currency: string;
    providerTx?: string | null;
}

interface PaymentsListProps {
    payments: Payment[];
}

export default function PaymentsList({ payments }: PaymentsListProps) {
    if (!payments || payments.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-900">Payments</p>
            <div className="space-y-3 text-sm">
                {payments.map((payment) => (
                    <div
                        key={payment.id}
                        className="rounded-xl border border-gray-100 p-3 space-y-1"
                    >
                        <div className="flex items-center justify-between text-gray-900">
                            <span className="font-medium">{payment.provider}</span>
                            <span className="text-xs uppercase tracking-wide">
                                {payment.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            Amount:{" "}
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: payment.currency,
                            }).format(payment.amount)}
                        </div>
                        {payment.providerTx && (
                            <div className="text-xs text-gray-500">
                                Reference: {payment.providerTx}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
