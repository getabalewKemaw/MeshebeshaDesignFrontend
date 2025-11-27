import ReviewForm from "@/components/reviews/ReviewForm";

interface ProductReviewModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    productId: string;
    variantSize: string | null;
    variantColor: string | null;
    onSuccess: () => void;
}

export default function ProductReviewModalWrapper({
    isOpen,
    onClose,
    orderId,
    productId,
    variantSize,
    variantColor,
    onSuccess,
}: ProductReviewModalWrapperProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <ReviewForm
                        orderId={orderId}
                        productId={productId}
                        variantSize={variantSize}
                        variantColor={variantColor}
                        onSuccess={onSuccess}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
