interface ProductsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function ProductsPagination({ currentPage, totalPages, onPageChange }: ProductsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-16 flex items-center justify-center gap-4">
            <button
                className="px-6 py-3 border-2 border-[#1E2A55] font-semibold text-[#1E2A55] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1E2A55] hover:text-white transition-all"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - currentPage) <= 1
                    ) {
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`w-12 h-12 font-semibold transition-all border-2 ${currentPage === pageNum
                                    ? "bg-[#1E2A55] text-white border-[#1E2A55]"
                                    : "bg-white border-gray-300 text-gray-700 hover:border-[#CFAE56] hover:text-[#CFAE56]"
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
                className="px-6 py-3 border-2 border-[#1E2A55] font-semibold text-[#1E2A55] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1E2A55] hover:text-white transition-all"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
