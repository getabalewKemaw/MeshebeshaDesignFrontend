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
} from "lucide-react";
import {
  getStockStatus,
  getVariantDisplayName,
  formatCurrency,
  COMMON_COLORS,
  COMMON_SIZES,
} from "@/lib/utils/product-utils";

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
    createVariant,
    updateVariant,
    deleteVariant,
    updateStock,
  } = useProductVariants(productId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sku: "",
    size: "",
    color: "",
    priceOverride: "",
    stock: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Reset form
  const resetForm = () => {
    setFormData({
      sku: "",
      size: "",
      color: "",
      priceOverride: "",
      stock: "",
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  // Handle create variant
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await createVariant({
        productId,
        sku: formData.sku || null,
        size: formData.size || null,
        color: formData.color || null,
        priceOverride: formData.priceOverride
          ? parseFloat(formData.priceOverride)
          : null,
        stock: parseInt(formData.stock) || 0,
      });

      if (response.success) {
        setSuccessMessage("Variant created successfully!");
        resetForm();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(response.error || "Failed to create variant");
      }
    } catch (err) {
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
      const response = await updateVariant(editingId, {
        sku: formData.sku || null,
        size: formData.size || null,
        color: formData.color || null,
        priceOverride: formData.priceOverride
          ? parseFloat(formData.priceOverride)
          : null,
        stock: parseInt(formData.stock) || 0,
      });

      if (response.success) {
        setSuccessMessage("Variant updated successfully!");
        resetForm();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(response.error || "Failed to update variant");
      }
    } catch (err) {
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
    } catch (err) {
      alert("Failed to delete variant");
    }
  };

  // Handle edit click
  const handleEditClick = (variant: ProductVariant) => {
    setEditingId(variant.id);
    setFormData({
      sku: variant.sku || "",
      size: variant.size || "",
      color: variant.color || "",
      priceOverride: variant.priceOverride?.toString() || "",
      stock: variant.stock.toString(),
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
    } catch (err) {
      alert("Failed to update stock");
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
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <select
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select size</option>
                  {COMMON_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
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
                      {variant.size && (
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <p className="font-medium text-gray-900">
                            {variant.size}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
