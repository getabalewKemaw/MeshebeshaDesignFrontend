/**
 * Review API Service
 * Centralized API calls for review-related operations
 */

import { apiRequest, ApiResponse } from './request';

export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string | null;
  variantSize: string | null;
  variantColor: string | null;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface ProductReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: {
    [key: number]: number; // rating -> count
  };
}

export interface CreateReviewPayload {
  rating: number; // 1-5
  comment?: string;
  variantSize?: string;
  variantColor?: string;
}

export { type ApiResponse };

/**
 * Create a review for a product from an order
 */
export async function createReview(
  orderId: string,
  productId: string,
  payload: CreateReviewPayload
): Promise<ApiResponse<Review>> {
  return apiRequest<Review>(`/api/v1/reviews/${orderId}/${productId}`, {
    method: 'POST',
    body: payload,
  });
}

/**
 * Check if current user can review a product
 * GET /reviews/eligibility/:productId
 */
export async function checkReviewEligibility(productId: string): Promise<ApiResponse<{ canReview: boolean; orderId?: string; message?: string }>> {
  return apiRequest<{ canReview: boolean; orderId?: string; message?: string }>(`/api/v1/reviews/eligibility/${productId}`, {
    method: 'GET',
  });
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(
  productId: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
  }
): Promise<ApiResponse<Review[]>> {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.offset) params.append('offset', options.offset.toString());
  if (options?.sortBy) params.append('sortBy', options.sortBy);

  const queryString = params.toString();
  const endpoint = `/api/v1/reviews/product/${productId}${queryString ? `?${queryString}` : ''}`;

  return apiRequest<Review[]>(endpoint, {
    method: 'GET',
  });
}

/**
 * Mark a review as helpful
 */
export async function markReviewHelpful(
  reviewId: string,
  isHelpful: boolean
): Promise<ApiResponse<{ helpfulCount: number; notHelpfulCount: number }>> {
  return apiRequest<{ helpfulCount: number; notHelpfulCount: number }>(
    `/api/v1/reviews/${reviewId}/helpful`,
    {
      method: 'POST',
      body: { isHelpful },
    }
  );
}

/**
 * Mark a review as not helpful
 */
export async function markReviewNotHelpful(
  reviewId: string
): Promise<ApiResponse<{ helpfulCount: number; notHelpfulCount: number }>> {
  return apiRequest<{ helpfulCount: number; notHelpfulCount: number }>(
    `/api/v1/reviews/${reviewId}/not-helpful`,
    {
      method: 'POST',
      body: { isHelpful: false },
    }
  );
}

/**
 * Admin: Get all reviews
 */
export async function getAllReviews(options?: {
  limit?: number;
  offset?: number;
  productId?: string;
  userId?: string;
  rating?: number;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
}): Promise<ApiResponse<Review[]>> {
  const params = new URLSearchParams();
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.offset) params.append('offset', options.offset.toString());
  if (options?.productId) params.append('productId', options.productId);
  if (options?.userId) params.append('userId', options.userId);
  if (options?.rating) params.append('rating', options.rating.toString());
  if (options?.sortBy) params.append('sortBy', options.sortBy);

  const queryString = params.toString();
  const endpoint = `/api/v1/admin/reviews${queryString ? `?${queryString}` : ''}`;

  return apiRequest<Review[]>(endpoint, {
    method: 'GET',
  });
}

/**
 * Admin: Delete a review
 */
export async function deleteReview(
  reviewId: string,
  productId: string
): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/v1/admin/reviews/${reviewId}?productId=${productId}`, {
    method: 'DELETE',
  });
}

/**
 * Get recent reviews for landing page
 */
export async function getRecentReviews(limit = 5, rating?: number): Promise<ApiResponse<Review[]>> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (rating) params.append('rating', rating.toString());

  const queryString = params.toString();
  const endpoint = `/api/v1/reviews/recent${queryString ? `?${queryString}` : ''}`;

  return apiRequest<Review[]>(endpoint, {
    method: 'GET',
  });
}
