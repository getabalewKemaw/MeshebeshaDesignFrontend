"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = "/auth/sign-in",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) { 
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (requireAdmin && !isAdmin) {
        router.push("/unauthorized");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, requireAdmin, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
