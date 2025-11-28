export default function ProductsLoading() {
    return (
        <div className="py-20">
            <div className="flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="h-16 w-16 border-4 border-gray-200"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 border-4 border-[#CFAE56] border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-6 text-lg text-gray-600 font-medium">Loading products...</p>
            </div>

            {/* Loading Skeleton */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-[3/4] w-full bg-gray-200"></div>
                        <div className="mt-3 space-y-2">
                            <div className="h-5 bg-gray-200 w-3/4"></div>
                            <div className="h-4 bg-gray-200 w-1/2"></div>
                            <div className="h-6 bg-gray-200 w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
