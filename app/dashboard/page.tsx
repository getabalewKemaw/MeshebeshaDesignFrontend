"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import Navbar from "@/components/NavBar";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(" ")[0]}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your account today
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Account Status</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {user?.emailVerified ? "Verified ✓" : "Pending"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✉️</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Member Since</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Account Type</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">
                    {user?.role || "User"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/profile"
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-3xl">👤</span>
                </div>
                <span className="font-semibold text-gray-900">Edit Profile</span>
              </a>

              <a
                href="/settings"
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-3xl">⚙️</span>
                </div>
                <span className="font-semibold text-gray-900">Settings</span>
              </a>

              <a
                href="/services"
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-3xl">🎨</span>
                </div>
                <span className="font-semibold text-gray-900">Services</span>
              </a>

              <a
                href="/contact"
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <span className="text-3xl">📞</span>
                </div>
                <span className="font-semibold text-gray-900">Contact Us</span>
              </a>
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Email</span>
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Name</span>
                <span className="text-gray-900">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Role</span>
                <span className="text-gray-900 capitalize">{user?.role || "User"}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Email Verified</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.emailVerified 
                    ? "bg-green-100 text-green-700" 
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {user?.emailVerified ? "Yes ✓" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
