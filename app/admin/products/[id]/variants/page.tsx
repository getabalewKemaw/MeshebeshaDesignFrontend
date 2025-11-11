/**
 * Product Variants Page
 * Full page for managing product variants
 */

"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/NavBar";
import ProductVariantManager from "@/components/products/ProductVariantManager";
import { ArrowLeft } from "lucide-react";

export default function ProductVariantsPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Product
        </button>

        {/* Variant Manager Component */}
        <ProductVariantManager productId={productId} />
      </main>
    </div>
  );
}
