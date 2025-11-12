"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/NavBar";
import { getPublicProductById, recordProductView } from "@/lib/api/products";
import type { ProductWithDetails, ProductMedia } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

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

  const renderMedia = (media: ProductMedia) => {
    if (media.mediaType === "video") {
      return <video key={media.id} src={media.url} controls className="w-full rounded" />;
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img key={media.id} src={media.url} alt={media.altText || product?.title || ""} className="w-full rounded" />;
  };

  const activeMedia = useMemo(() => product?.media?.[activeMediaIndex], [product?.media, activeMediaIndex]);
  const variants = product?.variants ?? [];

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <div className="py-10 text-center">Loading...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-600">{error}</div>
        ) : product ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                {activeMedia ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white">
                    {renderMedia(activeMedia)}
                  </div>
                ) : (
                  <div className="w-full h-72 bg-gray-100 rounded-xl" />
                )}
                {product.media && product.media.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.media.map((media, index) => (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => setActiveMediaIndex(index)}
                        className={`w-20 h-20 rounded-lg border overflow-hidden shrink-0 ${index === activeMediaIndex ? "border-purple-500 ring-2 ring-purple-200" : "border-transparent"}`}
                      >
                        {media.mediaType === "video" ? (
                          <video src={media.url} className="w-full h-full object-cover" muted />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={media.url} alt={media.altText || product.title} className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {product.category?.name && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs uppercase tracking-wide rounded-full">
                      {product.category.name}
                    </span>
                  )}
                  <span className="text-sm text-gray-400">ID: {product.id.slice(0, 8)}...</span>
                </div>
                <h1 className="text-3xl font-semibold text-gray-900">{product.title}</h1>
                <div className="text-2xl text-purple-600 font-semibold">
                  {product.currency} {product.price.toFixed(2)}
                </div>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {product.description || "No description."}
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-lg font-semibold mb-2">Variants</h2>
                  {variants.length === 0 ? (
                    <p className="text-sm text-gray-500">This product does not have additional variants.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="border border-gray-200 rounded-lg p-3 bg-white hover:border-purple-400 transition"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{variant.sku || "Variant"}</span>
                            {variant.priceOverride ? (
                              <span className="text-sm text-purple-600 font-semibold">
                                {product.currency} {variant.priceOverride.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Default price</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            {variant.size && <span className="px-2 py-1 bg-gray-100 rounded-full">Size: {variant.size}</span>}
                            {variant.color && <span className="px-2 py-1 bg-gray-100 rounded-full">Color: {variant.color}</span>}
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              Stock: {variant.stock}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              {product.media && product.media.length > 0 && (
                <h2 className="text-lg font-semibold mb-3">Gallery</h2>
              )}
              {product.media && product.media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.media.map((media) => (
                    <div key={media.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {renderMedia(media)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 border border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                  No media has been added for this product yet.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}


