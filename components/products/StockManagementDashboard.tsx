/**
 * Stock Management Dashboard
 * Bulk stock updates, low stock alerts, and inventory overview
 */

"use client";

import { useState } from "react";
import { useLowStock } from "@/lib/hooks/useProducts";
import * as productApi from "@/lib/api/products";
import { ProductVariant } from "@/types/product";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Search,
} from "lucide-react";
import {
  getStockStatus,
  formatCurrency,
  getVariantDisplayName,
} from "@/lib/utils/product-utils";

interface BulkUpdateItem {
  variantId: string;
  productTitle: string;
  variantName: string;
  currentStock: number;
  newStock: number;
}

export default function StockManagementDashboard() {
  const { lowStockItems, loading, error, refetch } = useLowStock(10);
  const [bulkUpdates, setBulkUpdates] = useState<BulkUpdateItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Add item to bulk update list
  const addToBulkUpdate = (item: ProductVariant) => {
    const exists = bulkUpdates.find((u) => u.variantId === item.id);
    if (!exists) {
      setBulkUpdates([
        ...bulkUpdates,
        {
          variantId: item.id,
          productTitle: item.product?.title || "Unknown",
          variantName: getVariantDisplayName(item),
          currentStock: item.stock,
          newStock: item.stock,
        },
      ]);
    }
  };

  // Update new stock value
  const updateNewStock = (variantId: string, newStock: number) => {
    setBulkUpdates(
      bulkUpdates.map((item) =>
        item.variantId === variantId ? { ...item, newStock } : item
      )
    );
  };

  // Remove from bulk update
  const removeFromBulkUpdate = (variantId: string) => {
    setBulkUpdates(bulkUpdates.filter((item) => item.variantId !== variantId));
  };

  // Apply bulk updates
  const applyBulkUpdates = async () => {
    if (bulkUpdates.length === 0) return;

    setUpdating(true);
    try {
      const updates = bulkUpdates.map((item) => ({
        variantId: item.variantId,
        stock: item.newStock,
      }));

      const response = await productApi.bulkUpdateStock(updates);

      if (response.success) {
        setSuccessMessage(
          `Successfully updated ${bulkUpdates.length} variants!`
        );
        setBulkUpdates([]);
        refetch();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(response.error || "Failed to update stock");
      }
    } catch {
      alert("Failed to update stock");
    } finally {
      setUpdating(false);
    }
  };

  // Export low stock report
  const exportLowStockReport = () => {
    const csv = [
      ["Product", "Variant", "Current Stock", "Status"],
      ...lowStockItems.map((item) => [
        item.product?.title || "Unknown",
        getVariantDisplayName(item),
        item.stock.toString(),
        getStockStatus(item.stock).label,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `low-stock-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredLowStock = lowStockItems.filter((item) =>
    item.product?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Stock Management Dashboard
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor inventory levels and manage stock
          </p>
        </div>
        <button
          onClick={refetch}
          className="form-button-primary flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {lowStockItems.length}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {lowStockItems.filter((item) => item.stock === 0).length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Updates</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {bulkUpdates.length}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Update Section */}
      {bulkUpdates.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Bulk Stock Updates ({bulkUpdates.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setBulkUpdates([])}
                className="form-button-secondary"
              >
                Clear All
              </button>
              <button
                onClick={applyBulkUpdates}
                disabled={updating}
                className="form-button-primary disabled:opacity-50"
              >
                {updating ? "Updating..." : "Apply Updates"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {bulkUpdates.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.productTitle}
                  </p>
                  <p className="text-sm text-gray-600">{item.variantName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Current</p>
                    <p className="font-semibold text-gray-900">
                      {item.currentStock}
                    </p>
                  </div>
                  <TrendingDown className="h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={item.newStock}
                    onChange={(e) =>
                      updateNewStock(item.variantId, parseInt(e.target.value))
                    }
                    min="0"
                    className="form-input-base w-24"
                  />
                  <button
                    onClick={() => removeFromBulkUpdate(item.variantId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Items */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Low Stock Alerts
          </h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input-base pl-10"
              />
            </div>
            <button
              onClick={exportLowStockReport}
              className="form-button-primary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredLowStock.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Low Stock Items
            </h3>
            <p className="text-gray-600">All products are well stocked!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLowStock.map((item) => {
                  const stockStatus = getStockStatus(item.stock);
                  const variantName = getVariantDisplayName(item);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product?.title || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {variantName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {item.stock} units
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.bgColor} ${stockStatus.textColor}`}
                        >
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(
                            item.priceOverride || item.product?.price || 0,
                            item.product?.currency || "ETB"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => addToBulkUpdate(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Add to Update
                        </button>
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
