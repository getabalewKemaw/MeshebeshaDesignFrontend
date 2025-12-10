"use client";

import { useEffect, useMemo, useState } from "react";
import { getPublicProducts, getFilterOptions } from "@/lib/api/products";
import type { ProductWithDetails, FilterOptions } from "@/types/product";
import Navbar from "@/components/NavBar";
import ProductsHeader from "@/components/products/listing/ProductsHeader";
import ProductsFilterBar from "@/components/products/listing/ProductsFilterBar";
import ProductsGrid from "@/components/products/listing/ProductsGrid";
import ProductsPagination from "@/components/products/listing/ProductsPagination";
import ProductsLoading from "@/components/products/listing/ProductsLoading";
import ProductsError from "@/components/products/listing/ProductsError";
import ProductsEmpty from "@/components/products/listing/ProductsEmpty";
import NewNavBar from "@/components/newlanding/NewNavBar";

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
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");

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
  const priceRange = useMemo(() => options?.priceRange ?? { min: 0, max: 10000 }, [options]);
  const appliedFilters = useMemo(() => {
    const active: string[] = [];
    if (filters.q) active.push("Search");
    if (filters.categoryId) active.push("Category");
    if (typeof filters.minPrice === "number" || typeof filters.maxPrice === "number") active.push("Price");
    return active;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, page: 1 });
    setTempMinPrice("");
    setTempMaxPrice("");
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyPriceFilter = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: tempMinPrice ? parseFloat(tempMinPrice) : undefined,
      maxPrice: tempMaxPrice ? parseFloat(tempMaxPrice) : undefined,
      page: 1,
    }));
  };

  const handleFilterChange = (updates: Partial<typeof DEFAULT_FILTERS>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      <NewNavBar />

      <main className="min-h-screen bg-gradient-to-b from-[#FFF9F0] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ProductsHeader />

          <ProductsFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            categoryOptions={categoryOptions}
            priceRange={priceRange}
            tempMinPrice={tempMinPrice}
            setTempMinPrice={setTempMinPrice}
            tempMaxPrice={tempMaxPrice}
            setTempMaxPrice={setTempMaxPrice}
            onApplyPriceFilter={handleApplyPriceFilter}
            onResetFilters={handleResetFilters}
            appliedFilters={appliedFilters}
            totalProducts={pagination.total}
          />

          {/* Products Grid */}
          {loading ? (
            <ProductsLoading />
          ) : error ? (
            <ProductsError error={error} onRetry={() => window.location.reload()} />
          ) : products.length === 0 ? (
            <ProductsEmpty onResetFilters={handleResetFilters} />
          ) : (
            <>
              <ProductsGrid products={products} />
              <ProductsPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
}
