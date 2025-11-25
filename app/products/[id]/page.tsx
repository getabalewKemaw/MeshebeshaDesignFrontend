"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";
import ProductMediaSlider from "@/components/products/ProductMediaSlider";
import ColorSelect from "@/components/products/ColorSelect";
import { getPublicProductById, recordProductView } from "@/lib/api/products";
import type { ProductWithDetails, ProductMedia, ProductVariant } from "@/types/product";
import { useCartStore } from "@/stores/cart";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import { checkReviewEligibility } from "@/lib/api/reviews";
import { useAuth } from "@/lib/hooks/useAuth";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { ShoppingCart, Zap } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isBuyingNow, setIsBuyingNow] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewsKey, setReviewsKey] = useState(0); // Force re-render after review creation
  const addItemToCart = useCartStore((state) => state.addItem);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      const res = await getPublicProductById(id);
      if (res.success && res.data) {
        setProduct(res.data);
        setActiveMediaIndex(0);
        // fire-and-forget view record
        recordProductView(id).catch(() => { });

        // Check if user can review this product (only if authenticated)
        if (isAuthenticated) {
          try {
            const eligibilityRes = await checkReviewEligibility(id);
            if (eligibilityRes.success && eligibilityRes.data?.canReview && eligibilityRes.data.orderId) {
              setReviewOrderId(eligibilityRes.data.orderId);
            } else {
              // User is authenticated but not eligible - clear any previous orderId
              setReviewOrderId(null);
            }
          } catch (err) {
            console.error('Failed to check review eligibility:', err);
            // Silently fail - don't show review button if check fails
            setReviewOrderId(null);
          }
        } else {
          // User not authenticated - clear orderId
          setReviewOrderId(null);
        }
      } else {
        setError(res.error || "Failed to load product");
      }
      setLoading(false);
    };
    run();
  }, [id, isAuthenticated]);

  const variants: ProductVariant[] = useMemo(
    () => product?.variants ?? [],
    [product?.variants]
  );

  const variantsByColor = useMemo(() => {
    const map = new Map<string, ProductVariant[]>();
    variants.forEach((variant) => {
      const key = variant.color || "Default";
      const existing = map.get(key) ?? [];
      existing.push(variant);
      map.set(key, existing);
    });
    return map;
  }, [variants]);

  const colorOptions = useMemo(
    () => Array.from(variantsByColor.keys()),
    [variantsByColor]
  );

  useEffect(() => {
    if (!product) return;
    if (variants.length > 0) {
      const initialVariant = variants[0];
      const initialColor = initialVariant.color || "Default";
      setSelectedColor((prev) => prev ?? initialColor);
      const initialSizes =
        initialVariant.availableSizes && initialVariant.availableSizes.length > 0
          ? initialVariant.availableSizes
          : initialVariant.size
            ? [initialVariant.size]
            : [];
      setSelectedSize((prev) => prev ?? (initialSizes[0] ?? null));
    } else {
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [product, variants]);

  useEffect(() => {
    if (colorOptions.length > 0 && (!selectedColor || !colorOptions.includes(selectedColor))) {
      setSelectedColor(colorOptions[0]);
    }
  }, [colorOptions, selectedColor]);

  const selectedVariant = useMemo(() => {
    if (colorOptions.length === 0) {
      return variants[0] ?? null;
    }
    const key = selectedColor ?? colorOptions[0];
    const matches = variantsByColor.get(key);
    return matches && matches.length > 0 ? matches[0] : variants[0] ?? null;
  }, [selectedColor, colorOptions, variantsByColor, variants]);

  const sizeOptions = useMemo(() => {
    if (!selectedVariant) return [];
    const key = selectedColor ?? selectedVariant.color ?? "Default";
    const tiedVariants = variantsByColor.get(key) ?? (selectedVariant ? [selectedVariant] : []);
    const collected = tiedVariants.flatMap((variant) => {
      if (variant.availableSizes && variant.availableSizes.length > 0) {
        return variant.availableSizes;
      }
      return variant.size ? [variant.size] : [];
    });
    return Array.from(new Set(collected.filter(Boolean)));
  }, [selectedVariant, selectedColor, variantsByColor]);

  useEffect(() => {
    if (!selectedVariant) {
      setSelectedSize(null);
      return;
    }
    if (sizeOptions.length === 0) {
      setSelectedSize(null);
      return;
    }
    if (!selectedSize || !sizeOptions.includes(selectedSize)) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [selectedVariant, sizeOptions, selectedSize]);

  const displayMedia: ProductMedia[] = useMemo(() => {
    const baseMedia = product?.media ?? [];
    const variantMedia = selectedVariant?.media ?? [];

    if (variantMedia.length === 0) {
      return baseMedia;
    }

    const byId = new Map<string, ProductMedia>();

    variantMedia.forEach((item) => {
      byId.set(item.id, item);
    });

    baseMedia.forEach((item) => {
      if (!byId.has(item.id)) {
        byId.set(item.id, item);
      }
    });

    return Array.from(byId.values());
  }, [product?.media, selectedVariant?.media]);

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [selectedVariant?.id, product?.id]);

  useEffect(() => {
    if (displayMedia.length === 0) {
      setActiveMediaIndex(0);
    } else {
      setActiveMediaIndex((prev) =>
        prev >= displayMedia.length ? displayMedia.length - 1 : prev
      );
    }
  }, [displayMedia.length]);

  const currentPrice =
    selectedVariant?.priceOverride ?? product?.price ?? 0;
  const isOutOfStock = (selectedVariant?.stock ?? 0) <= 0;

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant?.id, selectedSize]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!selectedVariant && variants.length === 0) {
      alert("This product is currently unavailable.");
      return;
    }
    if (sizeOptions.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }
    if (isOutOfStock) {
      alert("This variant is currently out of stock.");
      return;
    }
    setIsAdding(true);
    try {
      addItemToCart(
        {
          productId: product.id,
          variantId: selectedVariant?.id ?? null,
          title: product.title,
          subtitle: selectedVariant?.sku,
          color: selectedVariant?.color ?? selectedColor,
          size: selectedSize,
          image:
            selectedVariant?.media?.[0]?.url ??
            product.media?.[0]?.url ??
            displayMedia?.[0]?.url ??
            null,
          currency: product.currency,
          unitPrice: currentPrice,
          stock: selectedVariant?.stock ?? null,
        },
        quantity
      );
      setFeedback("Added to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!selectedVariant && variants.length === 0) {
      alert("This product is currently unavailable.");
      return;
    }
    if (sizeOptions.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }
    if (isOutOfStock) {
      alert("This variant is currently out of stock.");
      return;
    }
    setIsBuyingNow(true);
    try {
      addItemToCart(
        {
          productId: product.id,
          variantId: selectedVariant?.id ?? null,
          title: product.title,
          subtitle: selectedVariant?.sku,
          color: selectedVariant?.color ?? selectedColor,
          size: selectedSize,
          image:
            selectedVariant?.media?.[0]?.url ??
            product.media?.[0]?.url ??
            displayMedia?.[0]?.url ??
            null,
          currency: product.currency,
          unitPrice: currentPrice,
          stock: selectedVariant?.stock ?? null,
        },
        quantity
      );
      router.push("/checkout");
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="py-10 text-center">Loading...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : product ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <ProductMediaSlider
                  media={displayMedia}
                  activeIndex={activeMediaIndex}
                  onChangeActiveIndex={setActiveMediaIndex}
                  fallbackAlt={product.title}
                  contextNote={
                    selectedVariant?.media &&
                      selectedVariant.media.length > 0 &&
                      product.media &&
                      product.media.length > 0 ? (
                      <p className="mt-2 text-xs text-gray-400">
                        Showing media for{" "}
                        <span className="font-medium">
                          {selectedVariant.color || "Default"}
                        </span>{" "}
                        variant.
                      </p>
                    ) : null
                  }
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {product.category?.name && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs uppercase tracking-wide rounded-full">
                      {product.category.name}
                    </span>
                  )}
                  <span className="text-sm text-gray-400">
                    ID: {product.id.slice(0, 8)}...
                  </span>
                </div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  {product.title}
                </h1>

                {/* Rating Summary */}
                {(product.averageRating !== null || product.totalReviews > 0) && (
                  <ReviewSummary
                    averageRating={product.averageRating}
                    totalReviews={product.totalReviews}
                  />
                )}

                <div className="flex items-end gap-3">
                  <span className="text-3xl font-semibold text-purple-600">
                    {product.currency} {currentPrice.toFixed(2)}
                  </span>
                  {selectedVariant?.priceOverride && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.currency} {product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {selectedVariant?.sku && (
                    <span>SKU: {selectedVariant.sku}</span>
                  )}
                  <span>
                    Stock:{" "}
                    {selectedVariant
                      ? `${selectedVariant.stock} ${selectedVariant.stock === 1 ? "unit" : "units"
                      }`
                      : "Available"}
                  </span>
                </div>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {product.description || "No description."}
                </p>

                {colorOptions.length > 0 && (
                  <ColorSelect
                    colors={colorOptions}
                    value={selectedColor}
                    onChange={setSelectedColor}
                    disabled={isOutOfStock}
                  />
                )}

                {sizeOptions.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="size-select">
                      Size
                    </label>
                    <select
                      id="size-select"
                      value={selectedSize ?? ""}
                      onChange={(event) => setSelectedSize(event.target.value)}
                      disabled={isOutOfStock}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:opacity-50"
                    >
                      {sizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Quantity</span>
                    <QuantitySelector
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      max={selectedVariant?.stock && selectedVariant.stock > 0 ? selectedVariant.stock : undefined}
                    />
                    {typeof selectedVariant?.stock === "number" && selectedVariant.stock > 0 && (
                      <span className="text-xs text-gray-500">
                        {selectedVariant.stock} available
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Buy Now Button - Primary CTA */}
                      <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={
                          isOutOfStock ||
                          isBuyingNow ||
                          (sizeOptions.length > 0 && !selectedSize)
                        }
                        className="form-button-primary flex-1 gap-2"
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : isBuyingNow
                            ? "Processing..."
                            : (
                              <>
                                <Zap size={18} />
                                Buy Now
                              </>
                            )}
                      </button>

                      {/* Add to Cart Button - Secondary CTA */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={
                          isOutOfStock ||
                          isAdding ||
                          (sizeOptions.length > 0 && !selectedSize)
                        }
                        className="form-button-secondary flex-1 gap-2"
                      >
                        {isAdding ? (
                          "Adding..."
                        ) : (
                          <>
                            <ShoppingCart size={18} />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>

                    {/* Feedback Messages */}
                    <div className="text-sm text-center">
                      {feedback && (
                        <span className="text-green-600 font-medium">{feedback}</span>
                      )}
                      {!feedback && !isOutOfStock && (
                        <span className="text-gray-500">
                          Ready to ship within 2 business days
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="text-gray-500">
                          We'll notify you when it's back in stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">All Variants</h2>
              {variants.length === 0 ? (
                <p className="text-sm text-gray-500">
                  This product does not have additional variants.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {variants.map((variant) => {
                    const isActive = selectedVariant?.id === variant.id;
                    return (
                      <div
                        key={variant.id}
                        className={`border rounded-lg p-4 bg-white transition ${isActive
                            ? "border-purple-400 ring-2 ring-purple-100"
                            : "border-gray-200 hover:border-purple-300"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {variant.color || variant.sku || "Variant"}
                          </span>
                          {variant.priceOverride ? (
                            <span className="text-sm text-purple-600 font-semibold">
                              {product.currency}{" "}
                              {variant.priceOverride.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Default price
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {variant.availableSizes &&
                            variant.availableSizes.length > 0 && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full">
                                Sizes: {variant.availableSizes.join(", ")}
                              </span>
                            )}
                          {variant.color && (
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              Color: {variant.color}
                            </span>
                          )}
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            Stock: {variant.stock}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <ReviewList
                key={reviewsKey}
                productId={product.id}
                showWriteReview={!!reviewOrderId}
                orderId={reviewOrderId || undefined}
                variantSize={selectedSize}
                variantColor={selectedColor}
                onWriteReview={() => setShowReviewForm(true)}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && reviewOrderId && product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <ReviewForm
                orderId={reviewOrderId}
                productId={product.id}
                variantSize={selectedSize}
                variantColor={selectedColor}
                onSuccess={() => {
                  setShowReviewForm(false);
                  setReviewsKey((k) => k + 1); // Refresh reviews list
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


