"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Package, FolderTree, MessageSquare, TrendingUp } from "lucide-react";
export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) {
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Admin Dashboard 👋
        </h1>
        <p className="text-indigo-100">
          Welcome back, {user?.name}! Manage your store from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">1</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">5</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FolderTree className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Custom Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">1</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Products Card */}
          <a
            href="/admin/products"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Products</h3>
            <p className="text-gray-600 mb-4">
              Manage your product catalog, add new items, and update inventory
            </p>
            <span className="text-blue-600 font-semibold group-hover:underline">
              Manage Products →
            </span>
          </a>

          {/* Categories Card */}
          <a
            href="/admin/categories"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <FolderTree className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Categories</h3>
            <p className="text-gray-600 mb-4">
              Organize products into categories and manage hierarchy
            </p>
            <span className="text-green-600 font-semibold group-hover:underline">
              Manage Categories →
            </span>
          </a>

          {/* Custom Requests Card */}
          <a
            href="/admin/chat"
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Requests</h3>
            <p className="text-gray-600 mb-4">
              View and respond to customer custom design requests
            </p>
            <span className="text-purple-600 font-semibold group-hover:underline">
              View Requests →
            </span>
          </a>
        </div>
      </div>
    // </div>
  );
}
