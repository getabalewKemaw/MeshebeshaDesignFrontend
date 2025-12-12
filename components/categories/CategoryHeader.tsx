import Link from "next/link";

interface CategoryHeaderProps {
    categoryName: string;
    currentCount: number;
    totalCount: number;
}

export default function CategoryHeader({ categoryName, currentCount, totalCount }: CategoryHeaderProps) {
    return (
        <div className="mb-12 text-center">
            <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-[#CFAE56]/10 text-[#CFAE56] rounded-full text-sm font-semibold uppercase tracking-wider">
                    Category
                </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#310101] mb-4">
                {categoryName}
            </h1>
            <p className="text-lg text-gray-600">
                Showing{" "}
                <span className="font-semibold text-[#1E2A55]">{currentCount}</span>{" "}
                of{" "}
                <span className="font-semibold text-[#1E2A55]">{totalCount}</span>{" "}
                products
            </p>

            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600">
                <Link href="/" className="hover:text-[#310101] transition-colors">
                    Home
                </Link>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href="/products" className="hover:text-[#310101] transition-colors">
                    Products
                </Link>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[#310101] font-medium">{categoryName}</span>
            </div>
        </div>
    );
}
