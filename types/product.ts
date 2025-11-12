/**
 * Product Types
 * Centralized type definitions for products and related entities
 */

// Base Product interface
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  isActive: boolean;
  isFeatured: boolean;
  status: 'active' | 'archived' | 'draft';
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

// Product with relations
export interface ProductWithDetails extends Product {
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  media?: ProductMedia[];
  variants?: ProductVariant[];
  _count?: {
    views: number;
    reviews: number;
  };
}

// Product Variant
export interface ProductVariant {
  id: string;
  productId: string;
  sku: string | null;
  size: string | null;
  color: string | null;
  priceOverride: number | null;
  stock: number;
  availableSizes: string[];
  createdAt: string;
  updatedAt: string;
  media?: ProductMedia[];
  product?: {
    id: string;
    title: string;
    price: number;
    currency: string;
  };
}

// Product Media
export interface ProductMedia {
  id: string;
  productId: string;
  url: string;
  publicId: string | null;
  mediaType: 'image' | 'video';
  format: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  position: number;
  altText: string | null;
  description: string | null;
  createdAt: string;
  variantId?: string | null;
}

// Product Analytics
export interface ProductAnalytics {
  product: {
    id: string;
    title: string;
    price: number;
    createdAt: string;
  };
  views: {
    total: number;
    last7Days: number;
    last30Days: number;
  };
  orders: {
    total: number;
  };
}

// Trending Product
export interface TrendingProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  score: number;
  recentViews: number;
  recentOrders: number;
  media?: ProductMedia[];
}

// Search Filters
export interface ProductSearchFilters {
  q?: string;
  category?: string;
  categoryId?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'new' | 'trending' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
}

// Filter Options
export interface FilterOptions {
  colors: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
}

// Stock Update Request
export interface StockUpdateRequest {
  variantId: string;
  quantity: number;
  operation: 'increment' | 'decrement' | 'set';
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters?: ProductSearchFilters;
}
