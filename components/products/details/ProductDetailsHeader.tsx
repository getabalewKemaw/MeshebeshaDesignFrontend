import type { ProductWithDetails } from "@/types/product";
import ReviewSummary from "@/components/reviews/ReviewSummary";

interface ProductDetailsHeaderProps {
    product: ProductWithDetails;
}

export default function ProductDetailsHeader({ product }: ProductDetailsHeaderProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                {product.category?.name && (
                    <span className="px-3 py-1 bg-[#310101]/10 text-[#310101] text-xs uppercase tracking-wide rounded-full">
                        {product.category.name}
                    </span>
                )}
                <span className="text-sm text-gray-400">
                    ID: {product.id.slice(0, 8)}...
                </span>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900">
                {product.title}
            </h1>

            {/* Rating Summary */}
            {(product.averageRating !== null || product.totalReviews > 0) && (
                <ReviewSummary
                    averageRating={product.averageRating}
                    totalReviews={product.totalReviews}
                />
            )}
        </div>
    );
}
