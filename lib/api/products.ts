/**
 * Product API Service
 * Centralized API calls for product-related operations
 * All functions handle errors and return typed responses
 */

import {
  Product,
  ProductWithDetails,
  ProductVariant,
  ProductAnalytics,
  TrendingProduct,
  ProductSearchFilters,
  FilterOptions,
  StockUpdateRequest,
  ProductMedia,
  ApiResponse,
  PaginatedResponse,
} from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Helper function to make API calls with credentials
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

// ==================== PRODUCT CRUD ====================

/**
 * Get all products (admin)
 */
export async function getProducts(
  filters?: ProductSearchFilters
): Promise<ApiResponse<Product[]>> {
  const params = new URLSearchParams();
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  
  const query = params.toString();
  return apiCall<Product[]>(
    `/api/v1/admin/products${query ? `?${query}` : ''}`
  );
}

/**
 * Get product by ID (admin)
 */
export async function getProductById(
  id: string
): Promise<ApiResponse<ProductWithDetails>> {
  return apiCall<ProductWithDetails>(`/api/v1/admin/products/${id}`);
}

// ==================== PUBLIC BROWSE ====================
/**
 * Get public product list with filters
 * Supports: categoryId, search (q), minPrice, maxPrice, page, limit
 */
export async function getPublicProducts(params: {
  categoryId?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedResponse<ProductWithDetails>> {
  const qs = new URLSearchParams();
  if (params.categoryId) qs.append('categoryId', params.categoryId);
  if (params.q) qs.append('search', params.q);
  if (typeof params.minPrice === 'number') qs.append('minPrice', String(params.minPrice));
  if (typeof params.maxPrice === 'number') qs.append('maxPrice', String(params.maxPrice));
  if (params.page) qs.append('page', String(params.page));
  if (params.limit) qs.append('limit', String(params.limit));
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products${qs.toString() ? `?${qs.toString()}` : ''}`,
      { credentials: 'include' }
    );
    return await response.json();
  } catch (error) {
    console.error('Public list failed:', error);
    return {
      success: false,
      data: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  }
}

/**
 * Get public product details by ID
 */
export async function getPublicProductById(
  id: string
): Promise<ApiResponse<ProductWithDetails>> {
  return apiCall<ProductWithDetails>(`/api/v1/products/${id}`);
}

/**
 * Create product (admin)
 */
export async function createProduct(
  data: Partial<Product>
): Promise<ApiResponse<Product>> {
  return apiCall<Product>('/api/v1/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update product (admin)
 */
export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<ApiResponse<Product>> {
  return apiCall<Product>(`/api/v1/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete product (admin)
 */
export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/products/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Archive product (soft delete)
 */
export async function archiveProduct(
  id: string
): Promise<ApiResponse<Product>> {
  return apiCall<Product>(`/api/v1/admin/products/${id}/archive`, {
    method: 'POST',
  });
}

/**
 * Restore archived product
 */
export async function restoreProduct(
  id: string
): Promise<ApiResponse<Product>> {
  return apiCall<Product>(`/api/v1/admin/products/${id}/restore`, {
    method: 'POST',
  });
}

/**
 * Duplicate product
 */
export async function duplicateProduct(
  id: string
): Promise<ApiResponse<ProductWithDetails>> {
  return apiCall<ProductWithDetails>(`/api/v1/admin/products/${id}/duplicate`, {
    method: 'POST',
  });
}

// ==================== PRODUCT VARIANTS ====================

/**
 * Get all variants for a product
 */
export async function getProductVariants(
  productId: string
): Promise<ApiResponse<ProductVariant[]>> {
  return apiCall<ProductVariant[]>(
    `/api/v1/admin/products/${productId}/variants`
  );
}

/**
 * Get variant by ID
 */
export async function getVariantById(
  id: string
): Promise<ApiResponse<ProductVariant>> {
  return apiCall<ProductVariant>(`/api/v1/admin/products/variants/${id}`);
}

/**
 * Create product variant
 */
export async function createVariant(
  data: Partial<ProductVariant>
): Promise<ApiResponse<ProductVariant>> {
  return apiCall<ProductVariant>('/api/v1/admin/products/variants', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update product variant
 */
export async function updateVariant(
  id: string,
  data: Partial<ProductVariant>
): Promise<ApiResponse<ProductVariant>> {
  return apiCall<ProductVariant>(`/api/v1/admin/products/variants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Upload media for a specific variant
 */
export async function uploadVariantMedia(
  productId: string,
  variantId: string,
  files: FileList | File[]
): Promise<ApiResponse<ProductMedia[]>> {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('files', file));

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/admin/products/${productId}/variants/${variantId}/media`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Variant media upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload variant media',
    };
  }
}

/**
 * Get media for a specific variant
 */
export async function getVariantMedia(
  productId: string,
  variantId: string
): Promise<ApiResponse<ProductMedia[]>> {
  return apiCall<ProductMedia[]>(
    `/api/v1/admin/products/${productId}/variants/${variantId}/media`
  );
}

/**
 * Reorder variant media
 */
export async function reorderVariantMedia(
  productId: string,
  variantId: string,
  mediaIds: string[]
): Promise<ApiResponse<ProductMedia[]>> {
  return apiCall<ProductMedia[]>(
    `/api/v1/admin/products/${productId}/variants/${variantId}/media/reorder`,
    {
      method: 'POST',
      body: JSON.stringify({ mediaIds }),
    }
  );
}

/**
 * Delete media (product or variant)
 */
export async function deleteMedia(
  mediaId: string
): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/products/media/${mediaId}`, {
    method: 'DELETE',
  });
}

/**
 * Delete product variant
 */
export async function deleteVariant(id: string): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/admin/products/variants/${id}`, {
    method: 'DELETE',
  });
}

// ==================== STOCK MANAGEMENT ====================

/**
 * Update stock for a single variant
 */
export async function updateStock(
  variantId: string,
  stock: number
): Promise<ApiResponse<ProductVariant>> {
  return apiCall<ProductVariant>(
    `/api/v1/admin/products/variants/${variantId}/stock`,
    {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    }
  );
}

/**
 * Bulk update stock for multiple variants
 */
export async function bulkUpdateStock(
  updates: StockUpdateRequest[]
): Promise<ApiResponse<ProductVariant[]>> {
  return apiCall<ProductVariant[]>(
    '/api/v1/admin/products/variants/stock/bulk',
    {
      method: 'POST',
      body: JSON.stringify({ updates }),
    }
  );
}

/**
 * Check stock availability
 */
export async function checkStock(
  items: { variantId: string; quantity: number }[]
): Promise<ApiResponse<{ available: boolean; insufficientItems: string[] }>> {
  return apiCall<{ available: boolean; insufficientItems: string[] }>(
    '/api/v1/admin/products/variants/stock/check',
    {
      method: 'POST',
      body: JSON.stringify({ items }),
    }
  );
}

/**
 * Get product metrics for date range (admin)
 */
export async function getProductMetrics(
  productId: string,
  startDate: string,
  endDate: string
): Promise<ApiResponse<Record<string, unknown>[]>> {
  return apiCall<Record<string, unknown>[]>(
    `/api/v1/admin/products/${productId}/metrics?startDate=${startDate}&endDate=${endDate}`
  );
}

/**
 * Get top products by revenue (admin)
 */
export async function getTopProductsByRevenue(
  days: number = 30,
  limit: number = 10
): Promise<ApiResponse<Record<string, unknown>[]>> {
  return apiCall<Record<string, unknown>[]>(
    `/api/v1/admin/products/analytics/top-revenue?days=${days}&limit=${limit}`
  );
}

/**
 * Manually trigger metrics update (admin)
 */
export async function updateMetrics(): Promise<ApiResponse<Record<string, unknown>>> {
  return apiCall<Record<string, unknown>>(
    '/api/v1/admin/products/analytics/update-metrics',
    {
      method: 'POST',
    }
  );
}

/**
 * Get low stock variants
 */
export async function getLowStock(
  threshold: number = 10
): Promise<ApiResponse<ProductVariant[]>> {
  return apiCall<ProductVariant[]>(
    `/api/v1/admin/products/variants/stock/low?threshold=${threshold}`
  );
}

// ==================== SEARCH & FILTERING (PUBLIC) ====================

/**
 * Search products with filters (public)
 */
export async function searchProducts(
  filters: ProductSearchFilters
): Promise<PaginatedResponse<ProductWithDetails>> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/public/products/search?${params.toString()}`,
      { credentials: 'include' }
    );
    return await response.json();
  } catch (error) {
    console.error('Search failed:', error);
    return {
      success: false,
      data: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  }
}

/**
 * Get filter options (public)
 */
export async function getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
  return apiCall<FilterOptions>('/api/v1/public/products/filters');
}

/**
 * Get product suggestions for autocomplete (public)
 */
export async function getProductSuggestions(
  query: string,
  limit: number = 5
): Promise<ApiResponse<ProductWithDetails[]>> {
  return apiCall<ProductWithDetails[]>(
    `/api/v1/public/products/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
  );
}

// ==================== ANALYTICS ====================

/**
 * Record product view (public)
 */
export async function recordProductView(
  productId: string
): Promise<ApiResponse<void>> {
  return apiCall<void>(`/api/v1/public/products/${productId}/view`, {
    method: 'POST',
  });
}

/**
 * Get trending products (public)
 */
export async function getTrendingProducts(
  limit: number = 10
): Promise<ApiResponse<TrendingProduct[]>> {
  return apiCall<TrendingProduct[]>(
    `/api/v1/public/products/trending?limit=${limit}`
  );
}

/**
 * Get most viewed products (public)
 */
export async function getMostViewedProducts(
  days: number = 7,
  limit: number = 10
): Promise<ApiResponse<ProductWithDetails[]>> {
  return apiCall<ProductWithDetails[]>(
    `/api/v1/public/products/most-viewed?days=${days}&limit=${limit}`
  );
}

/**
 * Get product analytics (admin)
 */
export async function getProductAnalytics(
  productId: string
): Promise<ApiResponse<ProductAnalytics>> {
  return apiCall<ProductAnalytics>(
    `/api/v1/admin/products/${productId}/analytics`
  );
}

