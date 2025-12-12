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
    <div className="space-y-8 border-t border-[#310101]/20 pt-8 border-b pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-[#310101]" style={{ fontFamily: 'Fraunces, serif' }}>
          Customer Reviews ({reviews.length > 0 ? reviews.length : "0"})
        </h2>

        <div className="flex items-center gap-4">
          {showWriteReview && orderId && (
            <button
              onClick={onWriteReview}
              className="px-6 py-2 bg-[#310101] text-white rounded-full hover:bg-[#4a0202] transition shadow-md font-medium"
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
            className="px-4 py-2 border border-[#310101]/20 rounded-lg focus:ring-2 focus:ring-[#310101] focus:border-transparent text-[#310101] bg-white cursor-pointer"
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
        <div className="py-12 text-center text-[#310101]/70 bg-[#310101]/5 rounded-xl">
          <p className="text-lg font-medium">No reviews yet.</p>
          <p className="text-sm mt-2">Be the first to review this product!</p>
          {showWriteReview && orderId && (
            <button
              onClick={onWriteReview}
              className="mt-6 px-8 py-3 bg-[#310101] text-white rounded-full hover:bg-[#4a0202] transition shadow-lg font-bold uppercase tracking-wide text-sm"
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-[#310101]/10 pb-8 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.user.image ? (
                    <img
                      src={review.user.image}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full border border-[#310101]/10 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#310101]/10 flex items-center justify-center text-[#310101] font-bold text-lg">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[#310101] text-lg">
                        {review.user.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-[#310101]/60 font-medium uppercase tracking-wider">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(review.variantSize || review.variantColor) && (
                    <div className="mt-3 flex gap-2">
                      {review.variantSize && (
                        <span className="px-3 py-1 text-xs bg-[#310101]/5 text-[#310101] rounded-full border border-[#310101]/10">
                          Size: {review.variantSize}
                        </span>
                      )}
                      {review.variantColor && (
                        <span className="px-3 py-1 text-xs bg-[#310101]/5 text-[#310101] rounded-full border border-[#310101]/10">
                          Color: {review.variantColor}
                        </span>
                      )}
                    </div>
                  )}

                  {review.comment && (
                    <p className="mt-4 text-[#310101]/80 leading-relaxed max-w-3xl">
                      {review.comment}
                    </p>
                  )}

                  <div className="mt-4 pt-4 flex items-center text-[#310101]/60">
                    <HelpfulButton
                      reviewId={review.id}
                      initialHelpfulCount={review.helpfulCount}
                      initialNotHelpfulCount={review.notHelpfulCount}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-[#310101]/20">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 border border-[#310101]/20 rounded-full hover:bg-[#310101]/5 disabled:opacity-50 disabled:cursor-not-allowed text-[#310101] transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-[#310101] font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-2 border border-[#310101]/20 rounded-full hover:bg-[#310101]/5 disabled:opacity-50 disabled:cursor-not-allowed text-[#310101] transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}


