import { useSession } from "@/lib/auth-client";

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  return {
    user: session?.user,
    session,
    isLoading: isPending,
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === "admin",
    isUser: session?.user?.role === "user",
    error,
  };
}
