"use client";

import { useState } from "react";
import StarRating from "./StarRating";
import { createReview, type CreateReviewPayload } from "@/lib/api/reviews";

interface ReviewFormProps {
  orderId: string;
  productId: string;
  variantSize?: string | null;
  variantColor?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  orderId,
  productId,
  variantSize,
  variantColor,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateReviewPayload = {
        rating,
        comment: comment.trim() || undefined,
        variantSize: variantSize || undefined,
        variantColor: variantColor || undefined,
      };

      const response = await createReview(orderId, productId, payload);

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.error || "Failed to submit review");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Review submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Write a Review</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            interactive={true}
            size="lg"
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Review (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={2000}
            className="form-input-base"
            placeholder="Share your experience with this product..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {comment.length}/2000 characters
          </p>
        </div>

        {(variantSize || variantColor) && (
          <div className="text-sm text-gray-600">
            <p>
              Variant: {variantSize && `Size ${variantSize}`}
              {variantSize && variantColor && " • "}
              {variantColor && `Color ${variantColor}`}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="form-button-primary flex-1"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="form-button-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}






