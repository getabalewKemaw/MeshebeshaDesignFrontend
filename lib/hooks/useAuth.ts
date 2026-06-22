import { useSession, getSession } from "@/lib/auth-client";
import type { User } from "@/types/auth";

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  // Cast to our extended User type which includes custom fields (phone, country, etc.)
  const user = session?.user as User | undefined;

  // Function to refresh the session/user data
  const refreshUser = async () => {
    try {
      // getSession will fetch the latest session from the server
      const latestSession = await getSession();
      return latestSession;
    } catch (e) {
      console.error("Failed to refresh user session", e);
    }
  };

  return {
    user,
    session,
    isLoading: isPending,
    isAuthenticated: !!session,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
    error,
    refreshUser,
  };
}
