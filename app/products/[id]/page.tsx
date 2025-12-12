"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProductMediaSlider from "@/components/products/ProductMediaSlider";
import { getPublicProductById, recordProductView } from "@/lib/api/products";
import type { ProductWithDetails, ProductMedia, ProductVariant } from "@/types/product";
import { useCartStore } from "@/stores/cart";
import ReviewList from "@/components/reviews/ReviewList";
import { checkReviewEligibility } from "@/lib/api/reviews";
import { useAuth } from "@/lib/hooks/useAuth";
import ProductDetailsHeader from "@/components/products/details/ProductDetailsHeader";
import ProductInfo from "@/components/products/details/ProductInfo";
import ProductActions from "@/components/products/details/ProductActions";
import ProductVariantsList from "@/components/products/details/ProductVariantsList";
import ProductReviewModalWrapper from "@/components/products/details/ProductReviewModalWrapper";
import NewNavBar from "@/components/newlanding/NewNavBar";
import FooterSection from "@/components/newlanding/FooterSection";

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
            console.log("DEBUG: Review eligibility check response:", eligibilityRes);

            if (eligibilityRes.success && eligibilityRes.data?.canReview && eligibilityRes.data.orderId) {
              console.log("DEBUG: User is eligible to review. Order ID:", eligibilityRes.data.orderId);
              setReviewOrderId(eligibilityRes.data.orderId);
            } else {
              console.log("DEBUG: User is NOT eligible to review.", eligibilityRes.data);
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
      <NewNavBar />
      <div className="max-w-5xl mx-auto pt-32">
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
                <ProductDetailsHeader product={product} />

                <ProductInfo
                  product={product}
                  selectedVariant={selectedVariant}
                  currentPrice={currentPrice}
                  colorOptions={colorOptions}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  sizeOptions={sizeOptions}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                  isOutOfStock={isOutOfStock}
                />

                <ProductActions
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  selectedVariant={selectedVariant}
                  isOutOfStock={isOutOfStock}
                  isBuyingNow={isBuyingNow}
                  isAdding={isAdding}
                  sizeOptionsLength={sizeOptions.length}
                  selectedSize={selectedSize}
                  variantsLength={variants.length}
                  onBuyNow={handleBuyNow}
                  onAddToCart={handleAddToCart}
                  feedback={feedback}
                />
              </div>
            </div>

            <ProductVariantsList
              variants={variants}
              selectedVariantId={selectedVariant?.id}
              currency={product.currency}
            />

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

      <ProductReviewModalWrapper
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        orderId={reviewOrderId || ""}
        productId={product?.id || ""}
        variantSize={selectedSize}
        variantColor={selectedColor}
        onSuccess={() => {
          setShowReviewForm(false);
          setReviewsKey((k) => k + 1);
        }}
      />
      <FooterSection />
    </>
  );
}




