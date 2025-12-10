"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCategoryBySlug, CategoryWithProducts } from "@/lib/api/categories";
import Navbar from "@/components/NavBar";
import LoadingState from "@/components/categories/LoadingState";
import ErrorState from "@/components/categories/ErrorState";
import CategoryHeader from "@/components/categories/CategoryHeader";
import EmptyState from "@/components/categories/EmptyState";
import ProductsGrid from "@/components/categories/ProductsGrid";
import Pagination from "@/components/categories/Pagination";
import NewNavBar from "@/components/newlanding/NewNavBar";

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
            <NewNavBar />

            <main className="min-h-screen bg-linear-to-b from-[#FFF9F0] to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {loading ? (
                        <LoadingState />
                    ) : error ? (
                        <ErrorState error={error} />
                    ) : data ? (
                        <>
                            <CategoryHeader
                                categoryName={data.category.name}
                                currentCount={data.products.length}
                                totalCount={data.pagination.total}
                            />

                            {data.products.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <>
                                    <ProductsGrid products={data.products} />
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={data.pagination.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                            )}
                        </>
                    ) : null}
                </div>
            </main>
        </>
    );
}
