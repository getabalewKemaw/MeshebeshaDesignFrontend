"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Navbar from "@/components/NavBar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Update user profile
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white">
                  {getUserInitials()}
                </div>
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-gray-600 mt-1">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.emailVerified 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {user?.emailVerified ? "✓ Verified" : "Pending Verification"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 capitalize">
                      {user?.role || "User"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Profile Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="United States"
                />
              </div>

              {isEditing && (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || "",
                        phone: user?.phone || "",
                        country: user?.country || "",
                      });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Security */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Security</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Password</h3>
                  <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                </div>
                <a
                  href="/settings/change-password"
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                >
                  Change
                </a>
              </div>

              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <a
                  href="/settings/2fa"
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                >
                  Setup
                </a>
              </div>

              <div className="flex justify-between items-center py-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Active Sessions</h3>
                  <p className="text-sm text-gray-600">Manage your active sessions</p>
                </div>
                <a
                  href="/settings/sessions"
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
