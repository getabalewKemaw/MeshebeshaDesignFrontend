"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/NavBar";
import { getPublicProductById, recordProductView } from "@/lib/api/products";
import type { ProductWithDetails, ProductMedia, ProductVariant } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

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
        recordProductView(id).catch(() => {});
      } else {
        setError(res.error || "Failed to load product");
      }
      setLoading(false);
    };
    run();
  }, [id]);

  const renderMedia = (media: ProductMedia, className = "w-full rounded") => {
    if (media.mediaType === "video") {
      return <video src={media.url} controls className={className} />;
    }
    return (
      <img
        src={media.url}
        alt={media.altText || product?.title || "Product media"}
        className={className}
      />
    );
  };

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
    if (selectedVariant.availableSizes && selectedVariant.availableSizes.length > 0) {
      return selectedVariant.availableSizes;
    }
    if (selectedVariant.size) {
      return [selectedVariant.size];
    }
    return [];
  }, [selectedVariant]);

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

  const displayMedia = useMemo(() => {
    if (selectedVariant?.media && selectedVariant.media.length > 0) {
      return selectedVariant.media;
    }
    return product?.media ?? [];
  }, [selectedVariant?.media, product?.media]);

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

  const activeMedia = displayMedia[activeMediaIndex];
  const currentPrice =
    selectedVariant?.priceOverride ?? product?.price ?? 0;
  const isOutOfStock = (selectedVariant?.stock ?? 0) <= 0;

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
      const colorLabel = selectedVariant?.color || "Default";
      const sizeLabel = selectedSize ? ` / ${selectedSize}` : "";
      alert(
        `Added "${product.title}" (${colorLabel}${sizeLabel}) to your cart.`
      );
    } finally {
      setIsAdding(false);
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
                {activeMedia ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white">
                    {renderMedia(activeMedia)}
                  </div>
                ) : (
                  <div className="w-full h-72 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                    No media available yet.
                  </div>
                )}
                {displayMedia.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {displayMedia.map((media, index) => (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => setActiveMediaIndex(index)}
                        className={`w-20 h-20 rounded-lg border overflow-hidden shrink-0 ${
                          index === activeMediaIndex
                            ? "border-purple-500 ring-2 ring-purple-200"
                            : "border-transparent"
                        }`}
                      >
                        {media.mediaType === "video" ? (
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt={media.altText || product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {selectedVariant?.media &&
                  selectedVariant.media.length > 0 &&
                  product.media &&
                  product.media.length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Showing media for <span className="font-medium">
                        {selectedVariant.color || "Default"}
                      </span>{" "}
                      variant.
                    </p>
                  )}
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
                      ? `${selectedVariant.stock} ${
                          selectedVariant.stock === 1 ? "unit" : "units"
                        }`
                      : "Available"}
                  </span>
                </div>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {product.description || "No description."}
                </p>

                {colorOptions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Color
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => {
                        const isActive =
                          (selectedColor ?? colorOptions[0]) === color;
                        return (
                          <button
                            type="button"
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1 rounded-full border text-sm ${
                              isActive
                                ? "bg-purple-600 text-white border-purple-600"
                                : "border-gray-300 text-gray-700 hover:border-purple-400 hover:text-purple-600"
                            }`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {sizeOptions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Size
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((size) => {
                        const isActive = selectedSize === size;
                        const disabled = isOutOfStock;
                        return (
                          <button
                            type="button"
                            key={size}
                            onClick={() => !disabled && setSelectedSize(size)}
                            className={`px-3 py-1 rounded-full border text-sm ${
                              isActive
                                ? "bg-purple-600 text-white border-purple-600"
                                : "border-gray-300 text-gray-700 hover:border-purple-400 hover:text-purple-600"
                            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={disabled}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={
                      isOutOfStock ||
                      isAdding ||
                      (sizeOptions.length > 0 && !selectedSize)
                    }
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border border-transparent bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : isAdding
                      ? "Adding..."
                      : "Add to Cart"}
                  </button>
                  <span className="text-sm text-gray-500">
                    {isOutOfStock
                      ? "We'll notify you when it's back."
                      : "Ready to ship within 2 business days."}
                  </span>
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
                        className={`border rounded-lg p-4 bg-white transition ${
                          isActive
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

            {product.media && product.media.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Base Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.media.map((media) => (
                    <div
                      key={media.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {renderMedia(media)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}


