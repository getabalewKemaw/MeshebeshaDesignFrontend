'use client';

import { useState, useEffect } from 'react';
import { ProductWithDetails } from '@/types/product';
import { fetchCategoryBySlug } from '@/lib/api/categories';

export function useCategoryProducts(categorySlug: string, limit: number = 20) {
    const [products, setProducts] = useState<ProductWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            setLoading(true);
            console.log(`[useCategoryProducts] Starting DIRECT fetch for slug: "${categorySlug}"`);
            try {
                // Use the dedicated category extraction endpoint which calls /api/v1/categories/:slug
                // This avoids the issue where getFilterOptions() doesn't return all categories
                const data = await fetchCategoryBySlug(categorySlug, 1, limit);

                if (isMounted) {
                    if (data && data.products) {
                        console.log(`[useCategoryProducts] Successfully fetched category "${categorySlug}" with ${data.products.length} products`);
                        // Cast to ProductWithDetails because the endpoint returns products with media/variants included
                        setProducts((data.products as unknown as ProductWithDetails[]) || []);
                    } else {
                        console.warn(`[useCategoryProducts] No data found for category: "${categorySlug}" (fetchCategoryBySlug returned null/empty)`);
                        setProducts([]);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error(`[useCategoryProducts] Error fetching category "${categorySlug}":`, err);
                    setError(err instanceof Error ? err.message : 'An error occurred');
                    setProducts([]);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [categorySlug, limit]);

    return { products, loading, error };
}
