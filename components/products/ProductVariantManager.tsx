/**
 * Product Variant Manager Component
 * Manages product variants (size, color, stock, price)
 * Features: Add, Edit, Delete variants with stock management
 */

"use client";

import { useState } from "react";
import { useProductVariants } from "@/lib/hooks/useProducts";
import { ProductVariant } from "@/types/product";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  Check,
  X,
  ImagePlus,
} from "lucide-react";
import {
  getStockStatus,
  getVariantDisplayName,
  formatCurrency,
  COMMON_COLORS,
  COMMON_SIZES,
} from "@/lib/utils/product-utils";
import { deleteMedia } from "@/lib/api/products";

interface ProductVariantManagerProps {
  productId: string;
}

export default function ProductVariantManager({
  productId,
}: ProductVariantManagerProps) {
  const {
    variants,
    loading,
    error,
    refetch,
    createVariant,
    updateVariant,
    deleteVariant,
    updateStock,
    uploadVariantMedia,
  } = useProductVariants(productId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sku: "",
    color: "",
    priceOverride: "",
    stock: "",
    availableSizes: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadingVariantId, setUploadingVariantId] = useState<string | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);

  const toggleSizeSelection = (size: string) => {
    setFormData((prev) => {
      const exists = prev.availableSizes.includes(size);
      return {
        ...prev,
        availableSizes: exists
          ? prev.availableSizes.filter((s) => s !== size)
          : [...prev.availableSizes, size],
      };
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      sku: "",
      color: "",
      priceOverride: "",
      stock: "",
      availableSizes: [],
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  // Handle create variant
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (formData.availableSizes.length === 0) {
        alert("Please select at least one size.");
        setSubmitting(false);
        return;
      }

      const response = await createVariant({
        productId,
        sku: formData.sku || null,
        color: formData.color || null,
        priceOverride: formData.priceOverride
          ? parseFloat(formData.priceOverride)
          : null,
        stock: parseInt(formData.stock) || 0,
        availableSizes: formData.availableSizes,
      });

      if (response.success) {
        setSuccessMessage("Variant created successfully!");
        resetForm();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(response.error || "Failed to create variant");
      }
    } catch (error) {
      console.error("Failed to create variant", error);
      alert("Failed to create variant");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update variant
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    setSubmitting(true);

    try {
      if (formData.availableSizes.length === 0) {
        alert("Please select at least one size.");
        setSubmitting(false);
        return;
      }

      const response = await updateVariant(editingId, {
        sku: formData.sku || null,
        color: formData.color || null,
        priceOverride: formData.priceOverride
          ? parseFloat(formData.priceOverride)
          : null,
        stock: parseInt(formData.stock) || 0,
        availableSizes: formData.availableSizes,
      });

      if (response.success) {
        setSuccessMessage("Variant updated successfully!");
        resetForm();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(response.error || "Failed to update variant");
      }
    } catch (error) {
      console.error("Failed to update variant", error);
      alert("Failed to update variant");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete variant
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;

    try {
      const response = await deleteVariant(id);
      if (response.success) {
        setSuccessMessage("Variant deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(response.error || "Failed to delete variant");
      }
    } catch (error) {
      console.error("Failed to delete variant", error);
      alert("Failed to delete variant");
    }
  };

  // Handle edit click
  const handleEditClick = (variant: ProductVariant) => {
    setEditingId(variant.id);
    setFormData({
      sku: variant.sku || "",
      color: variant.color || "",
      priceOverride: variant.priceOverride?.toString() || "",
      stock: variant.stock.toString(),
      availableSizes:
        variant.availableSizes && variant.availableSizes.length > 0
          ? variant.availableSizes
          : variant.size
          ? [variant.size]
          : [],
    });
    setShowAddForm(true);
  };

  // Handle quick stock update
  const handleQuickStockUpdate = async (variantId: string, newStock: number) => {
    try {
      const response = await updateStock(variantId, newStock);
      if (response.success) {
        setSuccessMessage("Stock updated!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        alert(response.error || "Failed to update stock");
      }
    } catch (error) {
      console.error("Failed to update stock", error);
      alert("Failed to update stock");
    }
  };

  const handleVariantMediaUpload = async (variantId: string, files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }
    setUploadingVariantId(variantId);
    try {
      const response = await uploadVariantMedia(variantId, files);
      if (response.success) {
        setSuccessMessage("Media uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        alert(response.error || "Failed to upload media");
      }
    } catch (error) {
      console.error("Failed to upload media", error);
      alert("Failed to upload media");
    } finally {
      setUploadingVariantId(null);
    }
  };

  const handleDeleteVariantMedia = async (mediaId: string) => {
    if (!confirm("Remove this media item?")) {
      return;
    }

    setDeletingMediaId(mediaId);
    try {
      const response = await deleteMedia(mediaId);
      if (response.success) {
        await refetch();
        setSuccessMessage("Media deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 2000);
      } else {
        alert(response.error || "Failed to delete media");
      }
    } catch (error) {
      console.error("Failed to delete media", error);
      alert("Failed to delete media");
    } finally {
      setDeletingMediaId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Variants</h2>
          <p className="text-gray-600 mt-1">
            Manage sizes, colors, and stock levels
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="form-button-primary gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Variant
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="h-5 w-5" />
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Variant" : "Add New Variant"}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="e.g., SHIRT-BLU-M"
                  className="form-input-base"
                />
              </div>

              {/* Sizes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SIZES.map((size) => {
                    const selected = formData.availableSizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSizeSelection(size)}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          selected
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {formData.availableSizes.length === 0 && (
                  <p className="text-xs text-red-500 mt-2">
                    Select at least one size for this variant.
                  </p>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <select
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="form-input-base"
                >
                  <option value="">Select color</option>
                  {COMMON_COLORS.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Override */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Override (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.priceOverride}
                  onChange={(e) =>
                    setFormData({ ...formData, priceOverride: e.target.value })
                  }
                  placeholder="Leave empty to use base price"
                  className="form-input-base"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                  min="0"
                  placeholder="0"
                  className="form-input-base"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="form-button-primary"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                  ? "Update Variant"
                  : "Create Variant"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="form-button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Variants List */}
      {variants.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No variants yet
          </h3>
          <p className="text-gray-600 mb-6">
            Add your first variant to start managing inventory
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="form-button-primary gap-2"
          >
            <Plus className="h-5 w-5" />
            Add First Variant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {variants.map((variant) => {
            const stockStatus = getStockStatus(variant.stock);
            const displayName = getVariantDisplayName(variant);

            return (
              <div
                key={variant.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {displayName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bgColor} ${stockStatus.textColor}`}
                      >
                        {stockStatus.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {variant.sku && (
                        <div>
                          <span className="text-gray-500">SKU:</span>
                          <p className="font-medium text-gray-900">
                            {variant.sku}
                          </p>
                        </div>
                      )}
                      {variant.availableSizes && variant.availableSizes.length > 0 && (
                        <div>
                          <span className="text-gray-500">Sizes:</span>
                          <p className="font-medium text-gray-900">
                            {variant.availableSizes.join(", ")}
                          </p>
                        </div>
                      )}
                      {variant.color && (
                        <div>
                          <span className="text-gray-500">Color:</span>
                          <p className="font-medium text-gray-900">
                            {variant.color}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <p className="font-medium text-gray-900">
                          {variant.stock} units
                        </p>
                      </div>
                      {variant.priceOverride && (
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <p className="font-medium text-indigo-600">
                            {formatCurrency(variant.priceOverride)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditClick(variant)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit variant"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(variant.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete variant"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Quick Stock Adjustment */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Quick adjust:</span>
                    <button
                      onClick={() =>
                        handleQuickStockUpdate(variant.id, variant.stock - 10)
                      }
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      -10
                    </button>
                    <button
                      onClick={() =>
                        handleQuickStockUpdate(variant.id, variant.stock - 1)
                      }
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      -1
                    </button>
                    <button
                      onClick={() =>
                        handleQuickStockUpdate(variant.id, variant.stock + 1)
                      }
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      +1
                    </button>
                    <button
                      onClick={() =>
                        handleQuickStockUpdate(variant.id, variant.stock + 10)
                      }
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      +10
                    </button>
                  </div>
                </div>

                {/* Variant Media */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Variant Media
                    </span>
                    <label className="inline-flex items-center gap-2 px-3 py-1 border border-dashed border-indigo-300 text-indigo-600 rounded-lg text-sm cursor-pointer hover:bg-indigo-50">
                      <ImagePlus className="h-4 w-4" />
                      <span>
                        {uploadingVariantId === variant.id ? "Uploading..." : "Upload"}
                      </span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        disabled={uploadingVariantId === variant.id}
                        onChange={(e) => {
                          handleVariantMediaUpload(variant.id, e.target.files);
                          if (e.target) {
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                  </div>
                  {variant.media && variant.media.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {variant.media.map((media) => (
                        <div
                          key={media.id}
                          className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200"
                        >
                          {media.mediaType === "video" ? (
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                              muted
                              controls={false}
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={media.url}
                              alt={media.altText || variant.sku || "Variant media"}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteVariantMedia(media.id)}
                            disabled={deletingMediaId === media.id}
                            className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-600 p-1 rounded-full shadow"
                            title="Remove media"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No media uploaded for this variant yet.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
