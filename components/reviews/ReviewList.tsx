"use client";

import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import HelpfulButton from "./HelpfulButton";
import { getProductReviews, type Review } from "@/lib/api/reviews";

interface ReviewListProps {
  productId: string;
  showWriteReview?: boolean;
  orderId?: string;
  variantSize?: string | null;
  variantColor?: string | null;
  onWriteReview?: () => void;
}

export default function ReviewList({
  productId,
  showWriteReview = false,
  orderId,
  variantSize,
  variantColor,
  onWriteReview,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProductReviews(productId, {
        limit,
        offset: (page - 1) * limit,
        sortBy,
      });

      if (response.success && response.data) {
        setReviews(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError(response.error || "Failed to load reviews");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, page]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="mt-2 text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Customer Reviews ({reviews.length > 0 ? "..." : "0"})
        </h2>

        <div className="flex items-center gap-4">
          {showWriteReview && orderId && (
            <button
              onClick={onWriteReview}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Write Review
            </button>
          )}

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as typeof sortBy);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p className="text-lg">No reviews yet.</p>
          <p className="text-sm mt-2">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.user.image ? (
                    <img
                      src={review.user.image}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.user.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(review.variantSize || review.variantColor) && (
                    <div className="mt-2 flex gap-2">
                      {review.variantSize && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          Size: {review.variantSize}
                        </span>
                      )}
                      {review.variantColor && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          Color: {review.variantColor}
                        </span>
                      )}
                    </div>
                  )}

                  {review.comment && (
                    <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  )}

                  <HelpfulButton
                    reviewId={review.id}
                    initialHelpfulCount={review.helpfulCount}
                    initialNotHelpfulCount={review.notHelpfulCount}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

