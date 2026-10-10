'use client';

import { useState, useEffect } from 'react';
import { ProductWithDetails } from '@/types/product';
import { fetchCategoryBySlug } from '@/lib/api/categories';

const productsCache = new Map<string, ProductWithDetails[]>();

export function useCategoryProducts(
    categorySlug: string,
    limit: number = 20,
    enabled: boolean = true
) {
    const cacheKey = `${categorySlug}:${limit}`;
    const cachedData = productsCache.get(cacheKey);

    const [products, setProducts] = useState<ProductWithDetails[]>(() => cachedData || []);
    const [loading, setLoading] = useState<boolean>(() => !cachedData && enabled);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        let isMounted = true;

        const fetchProducts = async () => {
            // If already cached, populate immediately without showing loading spinner
            if (productsCache.has(cacheKey)) {
                if (isMounted) {
                    setProducts(productsCache.get(cacheKey) || []);
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            try {
                const data = await fetchCategoryBySlug(categorySlug, 1, limit);

                if (isMounted) {
                    if (data && data.products) {
                        const fetched = (data.products as unknown as ProductWithDetails[]) || [];
                        productsCache.set(cacheKey, fetched);
                        setProducts(fetched);
                    } else {
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
    }, [categorySlug, limit, enabled, cacheKey]);

    return { products, loading, error };
}
