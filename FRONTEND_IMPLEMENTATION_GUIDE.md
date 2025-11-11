# 🎨 Frontend Implementation Guide

## Overview
This guide explains the frontend integration for the new product management features. All code is maintainable, well-documented, and follows React best practices.

---

## 📁 File Structure

```
client/
├── types/
│   └── product.ts ✨ NEW - TypeScript types
├── lib/
│   ├── api/
│   │   └── products.ts ✨ NEW - API service layer
│   └── hooks/
│       └── useProducts.ts ✨ NEW - Custom React hooks
├── components/
│   ├── products/
│   │   ├── ProductVariantManager.tsx ✨ TO CREATE
│   │   ├── StockManager.tsx ✨ TO CREATE
│   │   ├── ProductSearch.tsx ✨ TO CREATE
│   │   └── ProductAnalytics.tsx ✨ TO CREATE
│   └── ui/
│       └── [existing components]
└── app/
    └── admin/
        └── products/
            ├── [id]/
            │   ├── variants/
            │   │   └── page.tsx ✨ TO CREATE
            │   ├── analytics/
            │   │   └── page.tsx ✨ TO CREATE
            │   └── [existing pages]
            └── page.tsx ✏️ TO ENHANCE
```

---

## ✅ Completed Steps

### Step 1: TypeScript Types ✅
**File**: `types/product.ts`

Created comprehensive type definitions:
- `Product` - Base product interface
- `ProductWithDetails` - Product with relations
- `ProductVariant` - Variant with size/color/stock
- `ProductAnalytics` - Analytics data structure
- `TrendingProduct` - Trending product data
- `ProductSearchFilters` - Search filter options
- `FilterOptions` - Available filter values
- `ApiResponse<T>` - Generic API response wrapper
- `PaginatedResponse<T>` - Paginated data wrapper

**Usage Example**:
```typescript
import { Product, ProductVariant } from '@/types/product';

const product: Product = {
  id: '123',
  title: 'T-Shirt',
  // ... other fields
};
```

---

### Step 2: API Service Layer ✅
**File**: `lib/api/products.ts`

Created centralized API functions for all backend endpoints:

#### Product CRUD
- `getProducts()` - Get all products
- `getProductById(id)` - Get single product
- `createProduct(data)` - Create new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product
- `archiveProduct(id)` - Soft delete
- `restoreProduct(id)` - Restore archived
- `duplicateProduct(id)` - Duplicate product

#### Variant Management
- `getProductVariants(productId)` - Get all variants
- `createVariant(data)` - Create variant
- `updateVariant(id, data)` - Update variant
- `deleteVariant(id)` - Delete variant

#### Stock Management
- `updateStock(variantId, stock)` - Update single stock
- `bulkUpdateStock(updates)` - Bulk update
- `checkStock(items)` - Check availability
- `getLowStock(threshold)` - Get low stock items

#### Search & Filtering
- `searchProducts(filters)` - Search with filters
- `getFilterOptions()` - Get available filters
- `getProductSuggestions(query)` - Autocomplete

#### Analytics
- `recordProductView(productId)` - Track view
- `getTrendingProducts(limit)` - Get trending
- `getMostViewedProducts(days, limit)` - Most viewed
- `getProductAnalytics(productId)` - Product stats
- `getProductMetrics(productId, dates)` - Metrics data
- `getTopProductsByRevenue(days, limit)` - Top products

**Usage Example**:
```typescript
import * as productApi from '@/lib/api/products';

// Fetch products
const response = await productApi.getProducts();
if (response.success) {
  console.log(response.data);
}

// Search products
const results = await productApi.searchProducts({
  q: 'shirt',
  color: 'red',
  minPrice: 20,
  maxPrice: 50,
  sort: 'price_asc',
});
```

---

### Step 3: Custom React Hooks ✅
**File**: `lib/hooks/useProducts.ts`

Created reusable hooks for data fetching:

#### `useProducts()`
Fetches all products with loading/error states.

```typescript
const { products, loading, error, refetch } = useProducts();
```

#### `useProduct(id)`
Fetches single product by ID.

```typescript
const { product, loading, error, refetch } = useProduct(productId);
```

#### `useProductVariants(productId)`
Manages product variants with CRUD operations.

```typescript
const {
  variants,
  loading,
  error,
  refetch,
  createVariant,
  updateVariant,
  deleteVariant,
  updateStock,
} = useProductVariants(productId);

// Create new variant
await createVariant({
  productId,
  size: 'M',
  color: 'Blue',
  stock: 100,
});
```

#### `useProductSearch(filters)`
Advanced search with filter management.

```typescript
const {
  products,
  filters,
  loading,
  error,
  pagination,
  search,
  updateFilters,
  resetFilters,
} = useProductSearch({ q: 'shirt' });

// Update filters
updateFilters({ color: 'red', minPrice: 20 });
```

#### `useTrendingProducts(limit)`
Fetches trending products.

```typescript
const { products, loading, error } = useTrendingProducts(10);
```

#### `useFilterOptions()`
Fetches available filter options.

```typescript
const { options, loading, error } = useFilterOptions();
// options.colors, options.sizes, options.categories
```

#### `useLowStock(threshold)`
Monitors low stock items.

```typescript
const { variants, loading, error, refetch } = useLowStock(10);
```

---

## 🎯 Next Steps: UI Components

### Step 4: Product Variants Manager Component

**File to create**: `components/products/ProductVariantManager.tsx`

**Features**:
- List all variants for a product
- Add new variant (size, color, SKU, stock, price override)
- Edit existing variants
- Delete variants
- Update stock levels
- Visual stock indicators (low stock warnings)

**Usage**:
```tsx
<ProductVariantManager productId={productId} />
```

---

### Step 5: Stock Management Component

**File to create**: `components/products/StockManager.tsx`

**Features**:
- Real-time stock levels
- Bulk stock updates
- Low stock alerts
- Stock history (if needed)
- Quick stock adjustment buttons (+10, -10, etc.)

**Usage**:
```tsx
<StockManager variants={variants} onUpdate={handleUpdate} />
```

---

### Step 6: Product Search Component

**File to create**: `components/products/ProductSearch.tsx`

**Features**:
- Search input with autocomplete
- Filter by category, color, size, price range
- Sort options (new, trending, price, popular)
- In-stock filter toggle
- Clear filters button
- Results count
- Pagination

**Usage**:
```tsx
<ProductSearch onResults={handleResults} />
```

---

### Step 7: Product Analytics Dashboard

**File to create**: `components/products/ProductAnalytics.tsx`

**Features**:
- View count (total, last 7 days, last 30 days)
- Order count
- Revenue metrics
- Trending score
- Charts (if using chart library)
- Date range selector

**Usage**:
```tsx
<ProductAnalytics productId={productId} />
```

---

### Step 8: Enhanced Product List Page

**File to enhance**: `app/admin/products/page.tsx`

**New Features to Add**:
- Duplicate product button
- Archive/Restore buttons
- Status badges (active, archived, draft)
- Quick stock view
- Trending indicator
- Filter by status
- Bulk actions

---

### Step 9: Product Variants Page

**File to create**: `app/admin/products/[id]/variants/page.tsx`

Full page for managing product variants with:
- Variant list table
- Add variant form
- Edit variant modal
- Stock management
- Low stock warnings

---

### Step 10: Product Analytics Page

**File to create**: `app/admin/products/[id]/analytics/page.tsx`

Full analytics dashboard for a product with:
- View statistics
- Order statistics
- Revenue charts
- Trending analysis
- Date range filters

---

## 🎨 Component Design Principles

### 1. **Maintainability**
- Small, focused components
- Clear prop interfaces
- Comprehensive comments
- Consistent naming conventions

### 2. **Reusability**
- Generic components where possible
- Props for customization
- No hard-coded values
- Composable design

### 3. **User Experience**
- Loading states for all async operations
- Error messages with retry options
- Success feedback (toasts/alerts)
- Optimistic UI updates where appropriate
- Responsive design

### 4. **Performance**
- Memoization with `useMemo` and `useCallback`
- Lazy loading for heavy components
- Debounced search inputs
- Pagination for large lists

---

## 📝 Code Style Guidelines

### TypeScript
```typescript
// ✅ Good: Explicit types
interface Props {
  productId: string;
  onUpdate: (variant: ProductVariant) => void;
}

// ❌ Bad: Any types
interface Props {
  productId: any;
  onUpdate: (variant: any) => void;
}
```

### React Components
```typescript
// ✅ Good: Functional component with TypeScript
export function ProductCard({ product }: { product: Product }) {
  return <div>{product.title}</div>;
}

// ✅ Good: With props interface
interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
}

export function ProductCard({ product, onEdit }: ProductCardProps) {
  return (
    <div>
      <h3>{product.title}</h3>
      {onEdit && <button onClick={onEdit}>Edit</button>}
    </div>
  );
}
```

### API Calls
```typescript
// ✅ Good: Error handling
const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await productApi.createVariant(data);
    if (response.success) {
      toast.success('Variant created!');
      onSuccess();
    } else {
      toast.error(response.error || 'Failed to create variant');
    }
  } catch (error) {
    toast.error('Network error');
  } finally {
    setLoading(false);
  }
};
```

---

## 🔧 Utility Functions

### Format Currency
```typescript
export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  return `${currency} ${amount.toFixed(2)}`;
}
```

### Format Date
```typescript
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
```

### Stock Status
```typescript
export function getStockStatus(stock: number): {
  label: string;
  color: string;
} {
  if (stock === 0) return { label: 'Out of Stock', color: 'red' };
  if (stock < 10) return { label: 'Low Stock', color: 'yellow' };
  return { label: 'In Stock', color: 'green' };
}
```

---

## 🚀 Implementation Priority

### Phase 1: Core Features (Week 1)
1. ✅ TypeScript types
2. ✅ API service layer
3. ✅ Custom hooks
4. 🔄 Product Variants Manager
5. 🔄 Enhanced Product List

### Phase 2: Advanced Features (Week 2)
6. Stock Management UI
7. Product Search & Filtering
8. Product Analytics Dashboard

### Phase 3: Polish (Week 3)
9. Loading skeletons
10. Error boundaries
11. Toast notifications
12. Responsive design improvements

---

## 📚 Resources

### Documentation
- React Hooks: https://react.dev/reference/react
- TypeScript: https://www.typescriptlang.org/docs/
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Backend API
- See `server/PRODUCT_MODULES_GUIDE.md` for API documentation
- See `server/MIGRATION_STEPS.md` for setup instructions

---

## ✅ Testing Checklist

### Before Deployment
- [ ] All TypeScript errors resolved
- [ ] All API endpoints tested
- [ ] Loading states work correctly
- [ ] Error handling works
- [ ] Success messages display
- [ ] Forms validate properly
- [ ] Responsive on mobile
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Performance optimized (no unnecessary re-renders)

---

## 🎉 Summary

**Completed**:
- ✅ TypeScript type definitions
- ✅ API service layer (20+ functions)
- ✅ Custom React hooks (7 hooks)
- ✅ Comprehensive documentation

**Next Steps**:
1. Create Product Variants Manager component
2. Enhance Product List page with new features
3. Build Stock Management interface
4. Add Product Search & Filtering
5. Create Analytics Dashboard

**All code is**:
- ✅ Maintainable (clear structure, comments)
- ✅ Understandable (descriptive names, documentation)
- ✅ Type-safe (full TypeScript support)
- ✅ Reusable (generic components, hooks)
- ✅ Production-ready (error handling, loading states)

---

**Ready to build the UI components!** 🚀
