import type { Category } from "@/types/product";

interface Filters {
    q: string;
    categoryId: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    page: number;
    limit: number;
}

interface ProductsFilterBarProps {
    filters: Filters;
    onFilterChange: (updates: Partial<Filters>) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    categoryOptions: Category[];
    priceRange: { min: number; max: number };
    tempMinPrice: string;
    setTempMinPrice: (val: string) => void;
    tempMaxPrice: string;
    setTempMaxPrice: (val: string) => void;
    onApplyPriceFilter: () => void;
    onResetFilters: () => void;
    appliedFilters: string[];
    totalProducts: number;
}

export default function ProductsFilterBar({
    filters,
    onFilterChange,
    showFilters,
    setShowFilters,
    categoryOptions,
    priceRange,
    tempMinPrice,
    setTempMinPrice,
    tempMaxPrice,
    setTempMaxPrice,
    onApplyPriceFilter,
    onResetFilters,
    appliedFilters,
    totalProducts,
}: ProductsFilterBarProps) {
    return (
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative group">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#310101] transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.q}
                            onChange={(e) => onFilterChange({ q: e.target.value, page: 1 })}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#310101] focus:ring-1 focus:ring-[#310101] focus:outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Filter Toggle Button (Mobile) */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[#1E2A55] text-white font-semibold rounded-lg hover:bg-[#2A3A65] active:scale-95 transition-all shadow-md"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters {appliedFilters.length > 0 && <span className="bg-[#310101] text-[#1E2A55] text-xs px-2 py-0.5 rounded-full">{appliedFilters.length}</span>}
                </button>

                {/* Desktop Filters */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={filters.categoryId}
                            onChange={(e) => onFilterChange({ categoryId: e.target.value, page: 1 })}
                            className="appearance-none px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#310101] focus:ring-1 focus:ring-[#310101] focus:outline-none transition-all min-w-[200px] cursor-pointer text-gray-700 font-medium"
                        >
                            <option value="">All Categories</option>
                            {categoryOptions.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Clear Filters */}
                    {appliedFilters.length > 0 && (
                        <button
                            onClick={onResetFilters}
                            className="px-6 py-3 text-[#1E2A55] font-semibold hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-500 font-medium">
                    Showing <span className="text-[#1E2A55] font-bold">{totalProducts}</span> results
                </div>
            </div>

            {/* Mobile Filters Dropdown */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mt-6 pt-6 border-t border-gray-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#1E2A55]">Category</label>
                        <div className="relative">
                            <select
                                value={filters.categoryId}
                                onChange={(e) => onFilterChange({ categoryId: e.target.value, page: 1 })}
                                className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#CFAE56] focus:ring-1 focus:ring-[#CFAE56] focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categoryOptions.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-[#1E2A55]">Price Range (ETB)</label>
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Min</span>
                                <input
                                    type="number"
                                    placeholder={priceRange.min.toString()}
                                    value={tempMinPrice}
                                    onChange={(e) => setTempMinPrice(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#CFAE56] focus:ring-1 focus:ring-[#CFAE56] focus:outline-none"
                                />
                            </div>
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Max</span>
                                <input
                                    type="number"
                                    placeholder={priceRange.max.toString()}
                                    value={tempMaxPrice}
                                    onChange={(e) => setTempMaxPrice(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#CFAE56] focus:ring-1 focus:ring-[#CFAE56] focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={onApplyPriceFilter}
                            className="w-full px-4 py-2.5 bg-[#310101] text-white font-semibold rounded-lg hover:bg-[#B89846] active:scale-95 transition-all shadow-sm"
                        >
                            Apply Price Filter
                        </button>
                    </div>

                    {appliedFilters.length > 0 && (
                        <button
                            onClick={onResetFilters}
                            className="w-full px-6 py-3 border border-gray-200 text-[#1E2A55] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Price Filter */}
            <div className="hidden lg:block mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-end gap-4">
                    <div className="flex-1 max-w-md">
                        <label className="block text-sm font-semibold text-[#1E2A55] mb-3">Price Range (ETB)</label>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-[#310101] transition-colors">Min</span>
                                <input
                                    type="number"
                                    placeholder={priceRange.min.toString()}
                                    value={tempMinPrice}
                                    onChange={(e) => setTempMinPrice(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#310101] focus:ring-1 focus:ring-[#310101] focus:outline-none transition-all"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="flex-1 relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-[#310101] transition-colors">Max</span>
                                <input
                                    type="number"
                                    placeholder={priceRange.max.toString()}
                                    value={tempMaxPrice}
                                    onChange={(e) => setTempMaxPrice(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#310101] focus:ring-1 focus:ring-[#310101] focus:outline-none transition-all"
                                />
                            </div>
                            <button
                                onClick={onApplyPriceFilter}
                                className="px-6 py-2.5 bg-[#310101] text-white font-semibold rounded-lg hover:bg-[#53050b] active:scale-95 transition-all shadow-sm"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
