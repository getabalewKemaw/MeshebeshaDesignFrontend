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
        <div className="mb-8 bg-white border-2 border-[#1E2A55] shadow-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:border-[#CFAE56] focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Filter Toggle Button (Mobile) */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[#1E2A55] text-white font-semibold hover:bg-[#2A3A65] transition-colors border-2 border-[#1E2A55]"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters {appliedFilters.length > 0 && `(${appliedFilters.length})`}
                </button>

                {/* Desktop Filters */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Category Filter */}
                    <select
                        value={filters.categoryId}
                        onChange={(e) => onFilterChange({ categoryId: e.target.value, page: 1 })}
                        className="px-4 py-3 border-2 border-gray-300 focus:border-[#CFAE56] focus:outline-none transition-colors min-w-[200px]"
                    >
                        <option value="">All Categories</option>
                        {categoryOptions.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    {appliedFilters.length > 0 && (
                        <button
                            onClick={onResetFilters}
                            className="px-6 py-3 border-2 border-[#1E2A55] text-[#1E2A55] font-semibold hover:bg-[#1E2A55] hover:text-white transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                    <span className="font-semibold text-[#1E2A55]">{totalProducts}</span> products
                </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {showFilters && (
                <div className="lg:hidden mt-6 pt-6 border-t-2 border-gray-200 space-y-4">
                    <select
                        value={filters.categoryId}
                        onChange={(e) => onFilterChange({ categoryId: e.target.value, page: 1 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-[#CFAE56] focus:outline-none"
                    >
                        <option value="">All Categories</option>
                        {categoryOptions.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Price Range Filter */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-[#1E2A55]">Price Range (ETB)</label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                placeholder={`Min (${priceRange.min})`}
                                value={tempMinPrice}
                                onChange={(e) => setTempMinPrice(e.target.value)}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 focus:border-[#CFAE56] focus:outline-none"
                            />
                            <input
                                type="number"
                                placeholder={`Max (${priceRange.max})`}
                                value={tempMaxPrice}
                                onChange={(e) => setTempMaxPrice(e.target.value)}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 focus:border-[#CFAE56] focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={onApplyPriceFilter}
                            className="w-full px-4 py-2 bg-[#CFAE56] text-white font-semibold hover:bg-[#B89846] transition-colors"
                        >
                            Apply Price Filter
                        </button>
                    </div>

                    {appliedFilters.length > 0 && (
                        <button
                            onClick={onResetFilters}
                            className="w-full px-6 py-3 border-2 border-[#1E2A55] text-[#1E2A55] font-semibold hover:bg-[#1E2A55] hover:text-white transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}

            {/* Desktop Price Filter */}
            <div className="hidden lg:block mt-6 pt-6 border-t-2 border-gray-200">
                <div className="flex items-end gap-4">
                    <div className="flex-1 max-w-sm">
                        <label className="block text-sm font-semibold text-[#1E2A55] mb-2">Price Range (ETB)</label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                placeholder={`Min (${priceRange.min})`}
                                value={tempMinPrice}
                                onChange={(e) => setTempMinPrice(e.target.value)}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 focus:border-[#CFAE56] focus:outline-none"
                            />
                            <input
                                type="number"
                                placeholder={`Max (${priceRange.max})`}
                                value={tempMaxPrice}
                                onChange={(e) => setTempMaxPrice(e.target.value)}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 focus:border-[#CFAE56] focus:outline-none"
                            />
                        </div>
                    </div>
                    <button
                        onClick={onApplyPriceFilter}
                        className="px-6 py-2 bg-[#CFAE56] text-white font-semibold hover:bg-[#B89846] transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
