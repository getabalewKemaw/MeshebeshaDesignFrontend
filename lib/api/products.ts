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
import { apiRequest } from './request';

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
  return apiRequest<Product[]>(
    `/api/v1/admin/products${query ? `?${query}` : ''}`
  );
}

/**
 * Get product by ID (admin)
 */
export async function getProductById(
  id: string
): Promise<ApiResponse<ProductWithDetails>> {
  return apiRequest<ProductWithDetails>(`/api/v1/admin/products/${id}`);
}

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

  const response = await apiRequest<ProductWithDetails[]>(
    `/api/v1/products${qs.toString() ? `?${qs.toString()}` : ''}`
  );

  // Transform standard ApiResponse to PaginatedResponse structure if needed
  // The backend returns { success, data, pagination } which matches PaginatedResponse
  return response as unknown as PaginatedResponse<ProductWithDetails>;
}

/**
 * Get public product details by ID
 */
export async function getPublicProductById(
  id: string
): Promise<ApiResponse<ProductWithDetails>> {
  return apiRequest<ProductWithDetails>(`/api/v1/products/${id}`);
}

/**
 * Create product (admin)
 */
export async function createProduct(
  data: Partial<Product>
): Promise<ApiResponse<Product>> {
  return apiRequest<Product>('/api/v1/admin/products', {
    method: 'POST',
    body: data,
  });
}

/**
 * Update product (admin)
 */
export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<ApiResponse<Product>> {
  return apiRequest<Product>(`/api/v1/admin/products/${id}`, {
    method: 'PUT',
    body: data,
  });
}

/**
 * Delete product (admin)
 */
export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/v1/admin/products/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Archive product (soft delete)
 */
export async function archiveProduct(
  id: string
): Promise<ApiResponse<Product>> {
  return apiRequest<Product>(`/api/v1/admin/products/${id}/archive`, {
    method: 'POST',
  });
}

/**
 * Restore archived product
 */
export async function restoreProduct(
  id: string
): Promise<ApiResponse<Product>> {
  return apiRequest<Product>(`/api/v1/admin/products/${id}/restore`, {
    method: 'POST',
  });
}

/**
 * Duplicate product
 */
export async function duplicateProduct(
  id: string
): Promise<ApiResponse<ProductWithDetails>> {
  return apiRequest<ProductWithDetails>(`/api/v1/admin/products/${id}/duplicate`, {
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
  return apiRequest<ProductVariant[]>(
    `/api/v1/admin/products/${productId}/variants`
  );
}

/**
 * Get variant by ID
 */
export async function getVariantById(
  id: string
): Promise<ApiResponse<ProductVariant>> {
  return apiRequest<ProductVariant>(`/api/v1/admin/products/variants/${id}`);
}

/**
 * Create product variant
 */
export async function createVariant(
  data: Partial<ProductVariant>
): Promise<ApiResponse<ProductVariant>> {
  return apiRequest<ProductVariant>('/api/v1/admin/products/variants', {
    method: 'POST',
    body: data,
  });
}

/**
 * Update product variant
 */
export async function updateVariant(
  id: string,
  data: Partial<ProductVariant>
): Promise<ApiResponse<ProductVariant>> {
  return apiRequest<ProductVariant>(`/api/v1/admin/products/variants/${id}`, {
    method: 'PUT',
    body: data,
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
  // in these case we use from data becuase we can not send files in json body
  Array.from(files).forEach((file) => formData.append('files', file));

  return apiRequest<ProductMedia[]>(
    `/api/v1/admin/products/${productId}/variants/${variantId}/media`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

/**
 * Get media for a specific variant
 */
export async function getVariantMedia(
  productId: string,
  variantId: string
): Promise<ApiResponse<ProductMedia[]>> {
  return apiRequest<ProductMedia[]>(
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
  return apiRequest<ProductMedia[]>(
    `/api/v1/admin/products/${productId}/variants/${variantId}/media/reorder`,
    {
      method: 'POST',
      body: { mediaIds },
    }
  );
}

/**
 * Delete media (product or variant)
 */
export async function deleteMedia(
  mediaId: string
): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/v1/admin/products/media/${mediaId}`, {
    method: 'DELETE',
  });
}

/**
 * Delete product variant
 */
export async function deleteVariant(id: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/v1/admin/products/variants/${id}`, {
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
  return apiRequest<ProductVariant>(
    `/api/v1/admin/products/variants/${variantId}/stock`,
    {
      method: 'PATCH',
      body: { stock },
    }
  );
}

/**
 * Bulk update stock for multiple variants
 */
export async function bulkUpdateStock(
  updates: StockUpdateRequest[]
): Promise<ApiResponse<ProductVariant[]>> {
  return apiRequest<ProductVariant[]>(
    '/api/v1/admin/products/variants/stock/bulk',
    {
      method: 'POST',
      body: { updates },
    }
  );
}

/**
 * Check stock availability
 */
export async function checkStock(
  items: { variantId: string; quantity: number }[]
): Promise<ApiResponse<{ available: boolean; insufficientItems: string[] }>> {
  return apiRequest<{ available: boolean; insufficientItems: string[] }>(
    '/api/v1/admin/products/variants/stock/check',
    {
      method: 'POST',
      body: { items },
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
  return apiRequest<Record<string, unknown>[]>(
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
  return apiRequest<Record<string, unknown>[]>(
    `/api/v1/admin/products/analytics/top-revenue?days=${days}&limit=${limit}`
  );
}

/**
 * Manually trigger metrics update (admin)
 */
export async function updateMetrics(): Promise<ApiResponse<Record<string, unknown>>> {
  return apiRequest<Record<string, unknown>>(
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
  return apiRequest<ProductVariant[]>(
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

  const response = await apiRequest<ProductWithDetails[]>(
    `/api/v1/public/products/search?${params.toString()}`
  );

  return response as unknown as PaginatedResponse<ProductWithDetails>;
}

/**
 * Get filter options (public)
 */
export async function getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
  return apiRequest<FilterOptions>('/api/v1/products/filters');
}

/**
 * Get product suggestions for autocomplete (public)
 */
export async function getProductSuggestions(
  query: string,
  limit: number = 5
): Promise<ApiResponse<ProductWithDetails[]>> {
  return apiRequest<ProductWithDetails[]>(
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
  return apiRequest<void>(
    `/api/v1/products/${productId}/view`,
    {
      method: 'POST',
    }
  );
}

/**
 * Get trending products (public)
 */
export async function getTrendingProducts(
  limit: number = 10
): Promise<ApiResponse<TrendingProduct[]>> {
  return apiRequest<TrendingProduct[]>(
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
  return apiRequest<ProductWithDetails[]>(
    `/api/v1/public/products/most-viewed?days=${days}&limit=${limit}`
  );
}

/**
 * Get product analytics (admin)
 */
export async function getProductAnalytics(
  productId: string
): Promise<ApiResponse<ProductAnalytics>> {
  return apiRequest<ProductAnalytics>(
    `/api/v1/admin/products/${productId}/analytics`
  );
}

