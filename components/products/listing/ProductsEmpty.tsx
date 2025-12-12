interface ProductsEmptyProps {
    onResetFilters: () => void;
}

export default function ProductsEmpty({ onResetFilters }: ProductsEmptyProps) {
    return (
        <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 mb-6 border-2 border-gray-300">
                <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms
            </p>
            <button
                onClick={onResetFilters}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#310101] text-white font-semibold hover:bg-[#2A3A65] transition-colors"
            >
                Clear Filters
            </button>
        </div>
    );
}
