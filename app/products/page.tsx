"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getPublicProducts, getFilterOptions } from "@/lib/api/products";
import type { ProductWithDetails, FilterOptions } from "@/types/product";
import Navbar from "@/components/NavBar";
import Image from "next/image";

const DEFAULT_FILTERS = {
  q: "",
  categoryId: "",
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  page: 1,
  limit: 12,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [pagination, setPagination] = useState<{ total: number; page: number; limit: number; totalPages: number }>({
    total: 0,
    page: 1,
    limit: DEFAULT_FILTERS.limit,
    totalPages: 0,
  });

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      const [optRes, listRes] = await Promise.all([
        getFilterOptions(),
        getPublicProducts({
          ...filters,
          categoryId: filters.categoryId || undefined,
          q: filters.q || undefined,
        }),
      ]);
      if (optRes.success && optRes.data) setOptions(optRes.data);
      if (listRes.success) {
        setProducts(listRes.data);
        setPagination(listRes.pagination);
      } else {
        setProducts([]);
        setError("Failed to load products");
      }
      setLoading(false);
    };
    run();
  }, [filters]);

  const categoryOptions = useMemo(() => options?.categories ?? [], [options]);
  const priceRange = useMemo(() => options?.priceRange ?? { min: 0, max: 0 }, [options]);
  const appliedFilters = useMemo(() => {
    const active: string[] = [];
    if (filters.q) active.push("Search");
    if (filters.categoryId) active.push("Category");
    if (typeof filters.minPrice === "number" || typeof filters.maxPrice === "number") active.push("Price");
    return active;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Browse Products</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{products.length}</span> of{" "}
            <span className="font-medium">{pagination.total}</span> products
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {appliedFilters.length > 0 && (
              <div className="text-xs text-gray-500">Active filters:</div>
            )}
            {appliedFilters.map((filter) => (
              <span key={filter} className="text-xs bg-purple-100 text-purple-700 py-1 px-2 rounded-full">
                {filter}
              </span>
            ))}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sm text-purple-600 hover:text-purple-800 underline underline-offset-4"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name or description"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.q}
              onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value, page: 1 }))}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Category</label>
            <select
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.categoryId}
              onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value, page: 1 }))}
            >
              <option value="">All Categories</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.productCount ? `(${c.productCount})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                placeholder={`Min ${priceRange.min}`}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                    page: 1,
                  }))
                }
              />
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                placeholder={`Max ${priceRange.max}`}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    page: 1,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center">Loading...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const cover = p.media?.[0];
                const categoryLabel = p.category?.name;
                const variantCount = p.variants?.length;
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
                  >
                    {cover ? (
                      cover.mediaType === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <Image
                         width={200}
                         height={200}
                          src={cover.url}
                          alt={cover.altText || p.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <video src={cover.url} className="w-full h-48 object-cover" muted controls={false} />
                      )
                    ) : (
                      <div className="w-full h-48 bg-gray-100" />
                    )}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="font-semibold text-gray-900 line-clamp-1">{p.title}</h2>
                        <span className="text-sm text-purple-600 font-medium">
                          {p.currency} {p.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{categoryLabel ?? "Uncategorized"}</span>
                        <span>{variantCount ? `${variantCount} variants` : "Single variant"}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                className="px-3 py-2 border rounded disabled:opacity-50"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              >
                Previous
              </button>
              <span className="text-sm">Page {pagination.page} of {pagination.totalPages}</span>
              <button
                className="px-3 py-2 border rounded disabled:opacity-50"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}


