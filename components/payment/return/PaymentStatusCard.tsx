interface PaymentStatusCardProps {
    children: React.ReactNode;
    variant: "success" | "failed" | "pending" | "error" | "loading";
}

export default function PaymentStatusCard({ children, variant }: PaymentStatusCardProps) {
    const variantStyles = {
        success: "bg-green-50 border-green-200",
        failed: "bg-red-50 border-red-200",
        pending: "bg-yellow-50 border-yellow-200",
        error: "bg-red-50 border-red-200",
        loading: "bg-blue-50 border-blue-200",
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className={`border rounded-xl p-8 ${variantStyles[variant]}`}>
                {children}
            </div>
        </div>
    );
}
