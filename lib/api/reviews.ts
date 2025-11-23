/**
 * Review API Service
 * Centralized API calls for review-related operations
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

/**
 * Helper function to make API calls
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Create a review for a product from an order
 */
export async function createReview(
  orderId: string,
  productId: string,
  payload: CreateReviewPayload
): Promise<ApiResponse<Review>> {
  return apiCall<Review>(`/api/v1/reviews/${orderId}/${productId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Check if current user can review a product
 * GET /reviews/eligibility/:productId
 */
export async function checkReviewEligibility(productId: string): Promise<ApiResponse<{ canReview: boolean; orderId?: string; message?: string }>> {
  return apiCall<{ canReview: boolean; orderId?: string; message?: string }>(`/api/v1/reviews/eligibility/${productId}`, {
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

  return apiCall<Review[]>(endpoint, {
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
  return apiCall<{ helpfulCount: number; notHelpfulCount: number }>(
    `/api/v1/reviews/${reviewId}/helpful`,
    {
      method: 'POST',
      body: JSON.stringify({ isHelpful }),
    }
  );
}

/**
 * Mark a review as not helpful
 */
export async function markReviewNotHelpful(
  reviewId: string
): Promise<ApiResponse<{ helpfulCount: number; notHelpfulCount: number }>> {
  return apiCall<{ helpfulCount: number; notHelpfulCount: number }>(
    `/api/v1/reviews/${reviewId}/not-helpful`,
    {
      method: 'POST',
      body: JSON.stringify({ isHelpful: false }),
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

  return apiCall<Review[]>(endpoint, {
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
  return apiCall<void>(`/api/v1/admin/reviews/${reviewId}?productId=${productId}`, {
    method: 'DELETE',
  });
}


