"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Copy,
  Archive,
  RotateCcw,
  Layers
} from "lucide-react";
import Image from 'next/image';
import { ProductWithDetails } from "@/types/product";
import * as productApi from "@/lib/api/products";
import { formatCurrency, getStatusBadge } from "@/lib/utils/product-utils";

export default function ProductsPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
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
        // Cast or ensure the data matches ProductWithDetails (it usually does from backend inclusions)
        setProducts(response.data as ProductWithDetails[]);
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

  const calculateTotalStock = (product: ProductWithDetails) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  };

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3D0C11] to-[#6b252bc0] font-heading drop-shadow-sm">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Manage all products in your store from here.</p>
        </div>
        <a
          href="/admin/products/new"
          className="bg-[#3D0C11] hover:bg-[#500e14] text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </a>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 mb-6 rounded-xl shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3D0C11] focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-[#3D0C11]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {search
                ? "We couldn't find any products matching your search. Try adjusting your keywords."
                : "Get started by adding your first product to your catalog."}
            </p>
            {!search && (
              <a
                href="/admin/products/new"
                className="inline-flex items-center gap-2 bg-[#3D0C11] text-white px-6 py-3 rounded-full hover:bg-[#500e14] transition-colors font-medium shadow-md"
              >
                <Plus className="h-5 w-5" />
                Add First Product
              </a>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#3D0C11] text-white">
                  <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wider">Image</th>
                  <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wider">Name</th>
                  <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wider">Price</th>
                  <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wider">Stock</th>
                  <th className="py-4 px-6 font-semibold text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const statusBadge = getStatusBadge(product.status || 'active');
                  const isArchived = product.status === 'archived';
                  const totalStock = calculateTotalStock(product);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-red-50/30 transition-colors duration-150 ${isArchived ? 'opacity-60 bg-gray-50' : ''}`}
                    >
                      <td className="py-4 px-6">
                        <div className="relative h-16 w-16 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          {product.media && product.media.length > 0 ? (
                            <Image
                              src={product.media[0].url}
                              alt={product.title}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full">
                              <ImageIcon className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-gray-900">{product.title}</p>
                          <div className="flex gap-2 mt-1">
                            {product.isFeatured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                Featured
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${product.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600 font-medium">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#8B0000] text-lg">
                          {formatCurrency(product.price, product.currency).replace('ETB', '')} Birr
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${totalStock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/admin/products/${product.id}/edit`}
                            title="Edit"
                            className="bg-slate-500 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => handleDelete(product.id)}
                            title="Delete"
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                          >
                            Delete
                          </button>

                          {/* Secondary Actions as Icons to preserve functionality minus clutter */}
                          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
                            <a
                              href={`/admin/products/${product.id}/variants`}
                              title="Manage Variants"
                              className="p-1.5 text-gray-400 hover:text-[#3D0C11] hover:bg-red-50 rounded transition-colors"
                            >
                              <Layers className="h-4 w-4" />
                            </a>
                            <a
                              href={`/admin/products/${product.id}/media`}
                              title="Manage Media"
                              className="p-1.5 text-gray-400 hover:text-[#3D0C11] hover:bg-red-50 rounded transition-colors"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => handleDuplicate(product.id)}
                              title="Duplicate"
                              className="p-1.5 text-gray-400 hover:text-[#3D0C11] hover:bg-red-50 rounded transition-colors"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            {!isArchived ? (
                              <button
                                onClick={() => handleArchive(product.id)}
                                title="Archive"
                                className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                              >
                                <Archive className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRestore(product.id)}
                                title="Restore"
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
