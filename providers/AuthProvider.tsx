"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface AuthProviderProps {
  children: React.ReactNode;
}

const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/products",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
  "/shipping",
  "/faq",
  "/cart",
  "/checkout",
  "/checkout/payment-options",
  "/newlanding",
];

const authRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/verify-email",
  "/auth/verify-2fa",
  "/auth/admin/sign-in",
];

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/auth/admin");
  const isCategoryRoute = pathname.startsWith("/categories/");
  const isProductDetailRoute = pathname.match(/^\/products\/[^\/]+$/);
  const canRenderWithoutAuth =
    isPublicRoute || isAuthRoute || isCategoryRoute || isProductDetailRoute;

  useEffect(() => {
    if (isLoading) return;

    // Allow access to auth pages (sign-in, sign-up, admin sign-in, etc.)
    if (isAuthRoute) {
      return;
    }

    // Protect admin routes (but not auth/admin routes)
    if (isAdminRoute && !isAdmin) {
      router.push("/");
      return;
    }

    // Protect private routes (but allow public routes, category routes, and product detail routes)
    if (!canRenderWithoutAuth && !isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }
  }, [
    canRenderWithoutAuth,
    isAuthenticated,
    isAdmin,
    isAdminRoute,
    isAuthRoute,
    isLoading,
    pathname,
    router,
  ]);

  // Public routes should not wait on the backend session check before showing content.
  if (isLoading && !canRenderWithoutAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
