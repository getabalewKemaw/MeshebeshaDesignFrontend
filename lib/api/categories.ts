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

/**
 * Fetch all categories from the API
 */
export async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await apiRequest<Category[]>('/api/v1/categories', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-store',// for  fetchign allways fresh data ,and not tostore the responses
            },
        });

        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch categories');
        }

        return response.data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
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
    try {
        const response = await apiRequest<CategoryWithProducts>(
            `/api/v1/categories/${slug}?page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-store',
                },
            }
        );

        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch category');
        }

        return response.data || null;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}
