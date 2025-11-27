import Link from "next/link";

interface ErrorStateProps {
    error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
    return (
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
    );
}
