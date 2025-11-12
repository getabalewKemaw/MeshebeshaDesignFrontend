/**
 * Stock Management Page
 * Full page for managing inventory and stock levels
 */

"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/NavBar";
import StockManagementDashboard from "@/components/products/StockManagementDashboard";

/**
 * Stock management page component that renders the admin inventory dashboard and enforces admin-only access.
 *
 * If authentication is loading, displays a centered spinner. If authentication has finished and the user is not
 * an admin, redirects to "/dashboard" and renders nothing. When the user is an admin, renders the page layout with
 * Navbar and the StockManagementDashboard.
 *
 * @returns The page's React element: a centered loading spinner while auth is loading, `null` for non-admin users,
 * or the admin dashboard layout when the user is an admin.
 */
export default function StockManagementPage() {
  const { isAdmin, isLoading } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StockManagementDashboard />
      </main>
    </div>
  );
}