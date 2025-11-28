import { useSession, getSession } from "@/lib/auth-client";

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  // Function to refresh the session/user data
  const refreshUser = async () => {
    try {
      // getSession will fetch the latest session from the server
      const latestSession = await getSession();
      // In a real implementation you might update a state or context here.
      // For now we simply return the latest session.
      return latestSession;
    } catch (e) {
      console.error("Failed to refresh user session", e);
    }
  };

  return {
    user: session?.user,
    session,
    isLoading: isPending,
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === "admin",
    isUser: session?.user?.role === "user",
    error,
    refreshUser,
  };
}
