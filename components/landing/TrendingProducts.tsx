"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/products/ProductCard";
import { getPublicProducts } from "@/lib/api/products";
import type { ProductWithDetails } from "@/types/product";

export default function TrendingProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getPublicProducts({
          limit: 8,
          page: 1,
        });

        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section
      className="bg-[#FAFAFA] px-4 py-16 font-body sm:px-6 lg:px-8"
      aria-labelledby="trending-heading"
    >
      {/* Header */}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
        <div>
          <p className="font-heading text-sm uppercase tracking-[0.35em] text-[#CFAE56]">
            Trending
          </p>
          <h2
            id="trending-heading"
            className="font-heading text-3xl font-semibold text-[#1E2A55] sm:text-4xl"
          >
            Trending Exclusives
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex w-fit items-center justify-center rounded-full border-2 border-[#1E2A55] px-6 py-3 text-sm font-semibold text-[#1E2A55] transition hover:bg-[#1E2A55] hover:text-white"
        >
          View All Products →
        </Link>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl">
        {loading ? (
          // Loading Skeleton
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white shadow-md"
              >
                <div className="aspect-square w-full rounded-t-2xl bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 w-full rounded bg-gray-200"></div>
                  <div className="h-4 w-32 rounded bg-gray-200"></div>
                  <div className="h-6 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-[#1E2A55] px-6 py-2 text-white hover:bg-[#CFAE56] transition"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-lg text-gray-600 mb-4">No products available yet</p>
            <Link
              href="/products"
              className="rounded-full bg-[#1E2A55] px-6 py-2 text-white hover:bg-[#CFAE56] transition"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Slider */}
            <div className="block lg:hidden relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                  {products.map((product) => {
                    const firstImage = product.media?.[0];

                    return (
                      <div key={product.id} className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_45%]">
                        <ProductCard
                          id={product.id}
                          title={product.title}
                          price={product.price}
                          currency={product.currency}
                          image={firstImage?.url}
                          averageRating={product.averageRating || undefined}
                          totalReviews={product.totalReviews || undefined}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              {products.length > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    className="rounded-full bg-white p-3 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1E2A55] hover:text-white transition-all"
                    aria-label="Previous products"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    className="rounded-full bg-white p-3 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1E2A55] hover:text-white transition-all"
                    aria-label="Next products"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid grid-cols-4 gap-6">
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
          </>
        )}
      </div>
    </section>
  );
}
