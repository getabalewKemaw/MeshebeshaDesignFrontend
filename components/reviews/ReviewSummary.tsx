"use client";

import StarRating from "./StarRating";

interface ReviewSummaryProps {
  averageRating: number | null;
  totalReviews: number;
}

export default function ReviewSummary({
  averageRating,
  totalReviews,
}: ReviewSummaryProps) {
  const rating = averageRating || 0;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <StarRating rating={Math.round(rating)} size="md" />
        <span className="text-2xl font-semibold text-gray-900">
          {rating > 0 ? rating.toFixed(1) : "0.0"}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        {totalReviews > 0 ? (
          <span>
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        ) : (
          <span>No reviews yet</span>
        )}
      </div>
    </div>
  );
}

