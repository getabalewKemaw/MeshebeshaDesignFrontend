/**
 * useProducts Hook
 * Custom hook for product data fetching and management
 * Provides loading states, error handling, and data caching
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Product,
  ProductWithDetails,
  ProductVariant,
  ProductSearchFilters,
  TrendingProduct,
  FilterOptions,
} from '@/types/product';
import * as productApi from '@/lib/api/products';

/**
 * Hook to fetch all products
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      const response = await productApi.getProducts();
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Failed to fetch products');
      }
      
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await productApi.getProducts();
    
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      setError(response.error || 'Failed to fetch products');
    }
    
    setLoading(false);
  }, []);

  return {
    products,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: string | null) {
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      const response = await productApi.getProductById(id);
      
      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError(response.error || 'Failed to fetch product');
      }
      
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const refetch = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    const response = await productApi.getProductById(id);
    
    if (response.success && response.data) {
      setProduct(response.data);
    } else {
      setError(response.error || 'Failed to fetch product');
    }
    
    setLoading(false);
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to manage product variants
 */
export function useProductVariants(productId: string | null) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchVariants = async () => {
      setLoading(true);
      setError(null);
      
      const response = await productApi.getProductVariants(productId);
      
      if (response.success && response.data) {
        setVariants(response.data);
      } else {
        setError(response.error || 'Failed to fetch variants');
      }
      
      setLoading(false);
    };

    fetchVariants();
  }, [productId]);

  const refetchVariants = useCallback(async () => {
    if (!productId) return;
    
    setLoading(true);
    setError(null);
    
    const response = await productApi.getProductVariants(productId);
    
    if (response.success && response.data) {
      setVariants(response.data);
    } else {
      setError(response.error || 'Failed to fetch variants');
    }
    
    setLoading(false);
  }, [productId]);

  // Helper functions for variant operations
  const createVariant = useCallback(async (data: Partial<ProductVariant>) => {
    const response = await productApi.createVariant(data);
    if (response.success) {
      await refetchVariants(); // Refresh list
    }
    return response;
  }, [refetchVariants]);

  const updateVariant = useCallback(async (id: string, data: Partial<ProductVariant>) => {
    const response = await productApi.updateVariant(id, data);
    if (response.success) {
      await refetchVariants(); // Refresh list
    }
    return response;
  }, [refetchVariants]);

  const deleteVariant = useCallback(async (id: string) => {
    const response = await productApi.deleteVariant(id);
    if (response.success) {
      await refetchVariants(); // Refresh list
    }
    return response;
  }, [refetchVariants]);

  const updateStock = useCallback(async (variantId: string, stock: number) => {
    const response = await productApi.updateStock(variantId, stock);
    if (response.success) {
      await refetchVariants(); // Refresh list
    }
    return response;
  }, [refetchVariants]);

  return {
    variants,
    loading,
    error,
    refetch: refetchVariants,
    createVariant,
    updateVariant,
    deleteVariant,
    updateStock,
  };
}

/**
 * Hook for product search with filters
 */
export function useProductSearch(initialFilters: ProductSearchFilters = {}) {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [filters, setFilters] = useState<ProductSearchFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const search = useCallback(async (newFilters?: ProductSearchFilters) => {
    const searchFilters = newFilters || filters;
    
    setLoading(true);
    setError(null);
    
    const response = await productApi.searchProducts(searchFilters);
    
    if (response.success) {
      setProducts(response.data);
      setPagination(response.pagination);
    } else {
      setError('Search failed');
      setProducts([]);
    }
    
    setLoading(false);
  }, [filters]);

  // Update filters and trigger search
  const updateFilters = (newFilters: Partial<ProductSearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    search(updated);
  };

  // Reset filters
  const resetFilters = () => {
    const reset: ProductSearchFilters = { page: 1, limit: 20 };
    setFilters(reset);
    search(reset);
  };

  return {
    products,
    filters,
    loading,
    error,
    pagination,
    search,
    updateFilters,
    resetFilters,
  };
}

/**
 * Hook for trending products
 */
export function useTrendingProducts(limit: number = 10) {
  const [products, setProducts] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      
      const response = await productApi.getTrendingProducts(limit);
      
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.error || 'Failed to fetch trending products');
      }
      
      setLoading(false);
    };

    fetchTrending();
  }, [limit]);

  return { products, loading, error };
}

/**
 * Hook for filter options
 */
export function useFilterOptions() {
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);
      
      const response = await productApi.getFilterOptions();
      
      if (response.success && response.data) {
        setOptions(response.data);
      } else {
        setError(response.error || 'Failed to fetch filter options');
      }
      
      setLoading(false);
    };

    fetchOptions();
  }, []);

  return { options, loading, error };
}

/**
 * Hook for low stock alerts
 */
export function useLowStock(threshold: number = 10) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStock = async () => {
      setLoading(true);
      setError(null);
      
      const response = await productApi.getLowStock(threshold);
      
      if (response.success && response.data) {
        setVariants(response.data);
      } else {
        setError(response.error || 'Failed to fetch low stock items');
      }
      
      setLoading(false);
    };

    fetchLowStock();
  }, [threshold]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await productApi.getLowStock(threshold);
    
    if (response.success && response.data) {
      setVariants(response.data);
    } else {
      setError(response.error || 'Failed to fetch low stock items');
    }
    
    setLoading(false);
  }, [threshold]);

  return {
    variants,
    loading,
    error,
    refetch,
  };
}
