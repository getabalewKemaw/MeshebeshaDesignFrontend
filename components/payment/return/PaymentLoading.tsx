import PaymentStatusCard from "./PaymentStatusCard";

export default function PaymentLoading() {
    return (
        <PaymentStatusCard variant="loading">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-semibold text-blue-900 mb-2">Processing Payment</h1>
            <p className="text-blue-700">
                Please wait while we verify your payment. This may take a few moments...
            </p>
        </PaymentStatusCard>
    );
}
