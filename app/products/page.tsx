"use client";

import { useEffect, useMemo, useState } from "react";
import { getPublicProducts, getFilterOptions } from "@/lib/api/products";
import type { ProductWithDetails, FilterOptions } from "@/types/product";
import Navbar from "@/components/NavBar";
import ProductCard from "@/components/products/ProductCard";

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
  const [showFilters, setShowFilters] = useState(false);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-[#FFF9F0] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-[#CFAE56]/10 text-[#CFAE56] rounded-full text-sm font-semibold uppercase tracking-wider">
                Shop
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E2A55] mb-4">
              All Products
            </h1>
            <p className="text-lg text-gray-600">
              Discover our complete collection of authentic Habesha fashion
            </p>
          </div>

          {/* Filters Bar */}
          <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.q}
                    onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value, page: 1 }))}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#CFAE56] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[#1E2A55] text-white rounded-full font-semibold hover:bg-[#2A3A65] transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Category Filter */}
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value, page: 1 }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#CFAE56] focus:outline-none transition-colors"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Clear Filters */}
                {appliedFilters.length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-[#1E2A55]">{pagination.total}</span> products
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {showFilters && (
              <div className="lg:hidden mt-6 pt-6 border-t border-gray-200 space-y-4">
                <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value, page: 1 }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#CFAE56] focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {appliedFilters.length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            // Loading State
            <div className="py-20">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-[#CFAE56] border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-6 text-lg text-gray-600 font-medium">Loading products...</p>
              </div>

              {/* Loading Skeleton */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square w-full bg-gray-200"></div>
                    <div className="mt-3 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            // Error State
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Products</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#1E2A55] text-white rounded-full font-semibold hover:bg-[#2A3A65] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            // Empty State
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#1E2A55] text-white rounded-full font-semibold hover:bg-[#2A3A65] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const firstImage = product.media?.[0];

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      currency={product.currency}
                      image={firstImage?.url}
                      averageRating={product.averageRating || undefined}
                      totalReviews={product.totalReviews || undefined}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-4">
                  <button
                    className="px-6 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#CFAE56] hover:text-[#CFAE56] transition-all"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.page) <= 1
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-12 h-12 rounded-full font-semibold transition-all ${pagination.page === pageNum
                                ? "bg-[#1E2A55] text-white"
                                : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#CFAE56] hover:text-[#CFAE56]"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === pagination.page - 2 ||
                        pageNum === pagination.page + 2
                      ) {
                        return (
                          <span key={pageNum} className="text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    className="px-6 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#CFAE56] hover:text-[#CFAE56] transition-all"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
