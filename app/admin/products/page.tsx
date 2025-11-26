"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, Plus, Search, Edit, Trash2, Image, Copy, Archive, RotateCcw, Layers } from "lucide-react";
import { Product } from "@/types/product";
import * as productApi from "@/lib/api/products";
import { formatCurrency, getStatusBadge } from "@/lib/utils/product-utils";

export default function ProductsPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!confirm("Duplicate this product?")) return;
    try {
      const response = await productApi.duplicateProduct(id);
      if (response.success) {
        alert("Product duplicated successfully!");
        fetchProducts();
      } else {
        alert(response.error || "Failed to duplicate product");
      }
    } catch (error) {
      alert("Failed to duplicate product");
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Archive this product?")) return;
    try {
      const response = await productApi.archiveProduct(id);
      if (response.success) {
        alert("Product archived successfully!");
        fetchProducts();
      } else {
        alert(response.error || "Failed to archive product");
      }
    } catch (error) {
      alert("Failed to archive product");
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm("Restore this product?")) return;
    try {
      const response = await productApi.restoreProduct(id);
      if (response.success) {
        alert("Product restored successfully!");
        fetchProducts();
      } else {
        alert(response.error || "Failed to restore product");
      }
    } catch (error) {
      alert("Failed to restore product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this product? This cannot be undone.")) return;
    try {
      const response = await productApi.deleteProduct(id);
      if (response.success) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert(response.error || "Failed to delete product");
      }
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <a
          href="/admin/products/new"
          className="form-button-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </a>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="form-input-base pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 text-center shadow-sm">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            {search
              ? "Try adjusting your search"
              : "Get started by adding your first product"}
          </p>
          {!search && (
            <a
              href="/admin/products/new"
              className="form-button-primary inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Your First Product
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const statusBadge = getStatusBadge(product.status || 'active');
            const isArchived = product.status === 'archived';

            return (
              <div
                key={product.id}
                className={`bg-white shadow-sm hover:shadow-md transition-shadow ${isArchived ? 'opacity-75' : ''
                  }`}
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <Image className="h-16 w-16 text-gray-400" width={280} height={280} />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex gap-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium ${product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium ${statusBadge.bgColor} ${statusBadge.textColor}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description || "No description"}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.price, product.currency)}
                    </span>
                    {product.isFeatured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`/admin/products/${product.id}/edit`}
                        className="form-button-secondary flex items-center justify-center gap-2 text-sm py-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </a>
                      <a
                        href={`/admin/products/${product.id}/variants`}
                        className="form-button-secondary flex items-center justify-center gap-2 text-sm py-2"
                      >
                        <Layers className="h-4 w-4" />
                        Variants
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`/admin/products/${product.id}/media`}
                        className="form-button-secondary flex items-center justify-center gap-2 text-sm py-2"
                      >
                        <Image className="h-4 w-4" />
                        Media
                      </a>
                      <button
                        onClick={() => handleDuplicate(product.id)}
                        className="form-button-secondary flex items-center justify-center gap-2 text-sm py-2"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {!isArchived ? (
                        <button
                          onClick={() => handleArchive(product.id)}
                          className="form-button-secondary flex items-center justify-center gap-2 text-sm py-2"
                        >
                          <Archive className="h-4 w-4" />
                          Archive
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(product.id)}
                          className="form-button-secondary flex items-center justify-center gap-2 text-sm py-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Restore
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="form-button-secondary flex items-center justify-center gap-2 text-sm py-2 text-red-600 hover:text-red-700 hover:border-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
    // </div>
  );
}
