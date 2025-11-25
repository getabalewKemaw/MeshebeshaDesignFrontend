const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
    products: any[];
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
        const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Categories API returned non-JSON response');
            return [];
        }

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        return data.data || [];
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
        const response = await fetch(
            `${API_BASE_URL}/api/v1/categories/${slug}?page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            }
        );

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Category API returned non-JSON response');
            return null;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}
