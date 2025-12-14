"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
}

export default function NewProductPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "USD",
    categoryId: "",
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchCategories();
    }
  }, [isAdmin]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        // Filter to only parent categories (no parentId)
        const parents = data.data.filter((cat: Category) => !cat.parentId);
        setParentCategories(parents);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch sub-categories when a parent is selected
  const fetchSubCategories = async (parentId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        // Filter to sub-categories of the selected parent
        const subs = data.data.filter((cat: Category) => cat.parentId === parentId);
        setSubCategories(subs);
      }
    } catch (error) {
      console.error("Failed to fetch sub-categories:", error);
    }
  };

  // Handle parent category selection
  const handleParentChange = (parentId: string) => {
    setSelectedParentId(parentId);
    setFormData({ ...formData, categoryId: parentId }); // Default to parent category
    
    if (parentId) {
      fetchSubCategories(parentId);
    } else {
      setSubCategories([]);
    }
  };

  // Handle sub-category selection (optional)
  const handleSubCategoryChange = (subCategoryId: string) => {
    setFormData({ ...formData, categoryId: subCategoryId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate that a category is selected
    if (!formData.categoryId) {
      setError("Please select a parent category");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            categoryId: formData.categoryId, // Use selected category (parent or sub)
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        router.push("/admin/products");
      } else {
        setError(data.error || "Failed to create product");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/admin/products"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">Create a new product in your catalog</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input-base"
                placeholder="e.g., Handwoven Ethiopian Scarf"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="form-input-base"
                placeholder="Describe your product..."
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Parent Category *
                </label>
                <select
                  value={selectedParentId}
                  onChange={(e) => handleParentChange(e.target.value)}
                  className="form-input-base"
                  required
                >
                  <option value="">Select a parent category</option>
                  {parentCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {parentCategories.length === 0 && !loadingCategories && (
                  <p className="text-sm text-gray-500 mt-1">
                    No categories available.{" "}
                    <a href="/admin/categories" className="text-indigo-600 hover:underline">
                      Create one first
                    </a>
                  </p>
                )}
              </div>

              {/* Sub-Category (Optional) */}
              {selectedParentId && subCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sub-Category (Optional)
                  </label>
                  <select
                    value={formData.categoryId === selectedParentId ? "" : formData.categoryId}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSubCategoryChange(e.target.value);
                      } else {
                        // If "No sub-category" is selected, use parent category
                        setFormData({ ...formData, categoryId: selectedParentId });
                      }
                    }}
                    className="form-input-base"
                  >
                    <option value="">No sub-category (use parent category)</option>
                    {subCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave as "No sub-category" to assign product directly to the parent category
                  </p>
                </div>
              )}
            </div>

            {/* Price & Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="form-input-base"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="form-input-base"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="ETB">ETB</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active (visible to customers)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured product
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="form-button-primary flex-1 gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Create Product
                </>
              )}
            </button>
            <a
              href="/admin/products"
              className="form-button-secondary"
            >
              Cancel
            </a>
          </div>
        </form>
    </div>
  );
}
