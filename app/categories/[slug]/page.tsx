"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchCategoryBySlug, CategoryWithProducts } from "@/lib/api/categories";
import Navbar from "@/components/NavBar";
import Image from "next/image";

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
            <div className="max-w-6xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center">
                        <p className="text-red-600 text-lg">{error}</p>
                        <Link href="/" className="mt-4 inline-block text-purple-600 hover:underline">
                            Go back to home
                        </Link>
                    </div>
                ) : data ? (
                    <>
                        {/* Category Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.category.name}</h1>
                            <p className="text-gray-600">
                                Showing <span className="font-medium">{data.products.length}</span> of{" "}
                                <span className="font-medium">{data.pagination.total}</span> products
                            </p>
                        </div>

                        {/* Products Grid */}
                        {data.products.length === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-gray-600 text-lg">No products found in this category.</p>
                                <Link href="/" className="mt-4 inline-block text-purple-600 hover:underline">
                                    Browse all products
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data.products.map((product: any) => {
                                        const cover = product.media?.[0];
                                        const variantCount = product.variants?.length || 0;

                                        return (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                className="block border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
                                            >
                                                {cover ? (
                                                    cover.mediaType === "image" ? (
                                                        <Image
                                                            width={400}
                                                            height={300}
                                                            src={cover.url}
                                                            alt={cover.altText || product.title}
                                                            className="w-full h-48 object-cover"
                                                        />
                                                    ) : (
                                                        <video
                                                            src={cover.url}
                                                            className="w-full h-48 object-cover"
                                                            muted
                                                            controls={false}
                                                        />
                                                    )
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h2 className="font-semibold text-gray-900 line-clamp-1">
                                                            {product.title}
                                                        </h2>
                                                        <span className="text-sm text-purple-600 font-medium whitespace-nowrap ml-2">
                                                            {product.currency} {product.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    {product.description && (
                                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                            {product.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <span>
                                                            {product.averageRating ? (
                                                                <span className="flex items-center gap-1">
                                                                    ⭐ {product.averageRating.toFixed(1)}
                                                                    <span className="text-gray-400">
                                                                        ({product.totalReviews})
                                                                    </span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">No reviews</span>
                                                            )}
                                                        </span>
                                                        <span>{variantCount ? `${variantCount} variants` : "Single variant"}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {data.pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-8">
                                        <button
                                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                            disabled={currentPage <= 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            Page {currentPage} of {data.pagination.totalPages}
                                        </span>
                                        <button
                                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                            disabled={currentPage >= data.pagination.totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : null}
            </div>
        </>
    );
}
