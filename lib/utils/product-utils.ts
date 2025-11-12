/**
 * Product Utility Functions
 * Helper functions for formatting and calculations
 */

/**
 * Format currency with symbol
 */
export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  return `${currency} ${amount.toFixed(2)}`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get stock status with color
 */
export function getStockStatus(stock: number): {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
} {
  if (stock === 0) {
    return {
      label: 'Out of Stock',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
    };
  }
  if (stock < 10) {
    return {
      label: 'Low Stock',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    };
  }
  return {
    label: 'In Stock',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  };
}

/**
 * Get product status badge styles
 */
export function getStatusBadge(status: string): {
  label: string;
  bgColor: string;
  textColor: string;
} {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
      };
    case 'archived':
      return {
        label: 'Archived',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
      };
    case 'draft':
      return {
        label: 'Draft',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
      };
    default:
      return {
        label: status,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
      };
  }
}

/**
 * Calculate total stock for all variants
 */
export function calculateTotalStock(variants: { stock: number }[]): number {
  return variants.reduce((sum, variant) => sum + variant.stock, 0);
}

/**
 * Format large numbers (e.g., 1000 -> 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Get trending badge color based on score
 */
export function getTrendingBadge(score: number): {
  label: string;
  bgColor: string;
  textColor: string;
  icon: string;
} {
  if (score >= 100) {
    return {
      label: 'Hot',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      icon: '🔥',
    };
  }
  if (score >= 50) {
    return {
      label: 'Trending',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: '📈',
    };
  }
  if (score >= 20) {
    return {
      label: 'Popular',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      icon: '⭐',
    };
  }
  return {
    label: 'New',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: '✨',
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate variant display name
 */
export function getVariantDisplayName(variant: {
  size?: string | null;
  color?: string | null;
  sku?: string | null;
  availableSizes?: string[];
}): string {
  const parts: string[] = [];
  
  if (variant.color) parts.push(variant.color);
  if (variant.availableSizes && variant.availableSizes.length > 0) {
    parts.push(variant.availableSizes.join('/'));
  } else if (variant.size) {
    parts.push(variant.size);
  }
  if (parts.length === 0 && variant.sku) parts.push(variant.sku);
  
  return parts.length > 0 ? parts.join(' / ') : 'Default';
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): {
  value: number;
  isIncrease: boolean;
  formatted: string;
} {
  if (previous === 0) {
    return {
      value: current > 0 ? 100 : 0,
      isIncrease: current > 0,
      formatted: current > 0 ? '+100%' : '0%',
    };
  }
  
  const change = ((current - previous) / previous) * 100;
  const isIncrease = change > 0;
  
  return {
    value: Math.abs(change),
    isIncrease,
    formatted: `${isIncrease ? '+' : '-'}${Math.abs(change).toFixed(1)}%`,
  };
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate color options for variants
 */
export const COMMON_COLORS = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',
  'Brown',
  'Gray',
  'Navy',
  'Beige',
  'Maroon',
  'Teal',
];

/**
 * Generate size options for variants
 */
export const COMMON_SIZES = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
  'One Size',
];

/**
 * Sort options for product search
 */
export const SORT_OPTIONS = [
  { value: 'new', label: 'Newest First' },
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];
