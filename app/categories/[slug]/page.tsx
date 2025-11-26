"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchCategoryBySlug, CategoryWithProducts } from "@/lib/api/categories";
import Navbar from "@/components/NavBar";
import ProductCard from "@/components/products/ProductCard";

export default function CategoryPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [data, setData] = useState<CategoryWithProducts | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadCategory = async () => {
            if (!slug) return;

            setLoading(true);
            setError(null);

            const result = await fetchCategoryBySlug(slug, currentPage, 12);

            if (result) {
                setData(result);
            } else {
                setError("Category not found");
            }

            setLoading(false);
        };

        loadCategory();
    }, [slug, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gradient-to-b from-[#FFF9F0] to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                                        <div className="aspect-square w-full bg-gray-200 rounded-t-2xl"></div>
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-6 py-3 bg-[#1E2A55] text-white rounded-full font-semibold hover:bg-[#2A3A65] transition-colors"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    ) : data ? (
                        <>
                            {/* Category Header */}
                            <div className="mb-12 text-center">
                                <div className="inline-block mb-4">
                                    <span className="px-4 py-2 bg-[#CFAE56]/10 text-[#CFAE56] rounded-full text-sm font-semibold uppercase tracking-wider">
                                        Category
                                    </span>
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E2A55] mb-4">
                                    {data.category.name}
                                </h1>
                                <p className="text-lg text-gray-600">
                                    Showing{" "}
                                    <span className="font-semibold text-[#1E2A55]">{data.products.length}</span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-[#1E2A55]">{data.pagination.total}</span>{" "}
                                    products
                                </p>

                                {/* Breadcrumb */}
                                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600">
                                    <Link href="/" className="hover:text-[#CFAE56] transition-colors">
                                        Home
                                    </Link>
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <Link href="/products" className="hover:text-[#CFAE56] transition-colors">
                                        Products
                                    </Link>
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="text-[#CFAE56] font-medium">{data.category.name}</span>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {data.products.length === 0 ? (
                                // Empty State
                                <div className="py-20 text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                                        <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h2>
                                    <p className="text-gray-600 mb-6">
                                        We haven't added any products to this category yet. Check back soon!
                                    </p>
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-[#1E2A55] text-white rounded-full font-semibold hover:bg-[#2A3A65] transition-colors"
                                    >
                                        Browse All Products
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {/* Products Grid - Using ProductCard Component */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {data.products.map((product: any) => {
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
                                    {data.pagination.totalPages > 1 && (
                                        <div className="mt-16 flex items-center justify-center gap-4">
                                            <button
                                                className="px-6 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#CFAE56] hover:text-[#CFAE56] transition-all"
                                                disabled={currentPage <= 1}
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <div className="flex items-center gap-2">
                                                {[...Array(data.pagination.totalPages)].map((_, i) => {
                                                    const pageNum = i + 1;
                                                    // Show first, last, current, and adjacent pages
                                                    if (
                                                        pageNum === 1 ||
                                                        pageNum === data.pagination.totalPages ||
                                                        Math.abs(pageNum - currentPage) <= 1
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`w-12 h-12 rounded-full font-semibold transition-all ${currentPage === pageNum
                                                                        ? "bg-[#1E2A55] text-white"
                                                                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#CFAE56] hover:text-[#CFAE56]"
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    } else if (
                                                        pageNum === currentPage - 2 ||
                                                        pageNum === currentPage + 2
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
                                                disabled={currentPage >= data.pagination.totalPages}
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : null}
                </div>
            </main>
        </>
    );
}
