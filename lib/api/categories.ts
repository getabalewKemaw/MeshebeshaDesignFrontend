import { apiRequest } from "./request";
import type { Product } from "@/types/product";

export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    createdAt: string;
    productCount?: number;
    parent?: Category | null;
    children?: Category[];
}

export interface CategoryWithProducts {
    category: Category;
    products: Product[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Client-side in-memory cache for public category responses (5-minute TTL)
const CATEGORY_CACHE_TTL_MS = 5 * 60 * 1000;
const categoriesCache: { data: Category[] | null; timestamp: number } = { data: null, timestamp: 0 };
const categorySlugCache = new Map<string, { data: CategoryWithProducts | null; timestamp: number }>();

/**
 * Fetch all categories from the API
 */
export async function fetchCategories(): Promise<Category[]> {
    const now = Date.now();
    if (categoriesCache.data && now - categoriesCache.timestamp < CATEGORY_CACHE_TTL_MS) {
        return categoriesCache.data;
    }

    try {
        const response = await apiRequest<Category[]>('/api/v1/categories', {
            method: 'GET',
        });

        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch categories');
        }

        const data = response.data || [];
        categoriesCache.data = data;
        categoriesCache.timestamp = now;
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return categoriesCache.data || [];
    }
}

/**
 * Fetch category by slug with products
 */
export async function fetchCategoryBySlug(
    slug: string,
    page: number = 1,
    limit: number = 20
): Promise<CategoryWithProducts | null> {
    const cacheKey = `${slug}:${page}:${limit}`;
    const now = Date.now();
    const cached = categorySlugCache.get(cacheKey);

    if (cached && now - cached.timestamp < CATEGORY_CACHE_TTL_MS) {
        return cached.data;
    }

    try {
        const response = await apiRequest<CategoryWithProducts>(
            `/api/v1/categories/${slug}?page=${page}&limit=${limit}`,
            {
                method: 'GET',
            }
        );

        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch category');
        }

        const data = response.data || null;
        categorySlugCache.set(cacheKey, { data, timestamp: now });
        return data;
    } catch (error) {
        console.error('Error fetching category:', error);
        return cached?.data || null;
    }
}
