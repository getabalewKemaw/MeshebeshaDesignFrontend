import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";
import { ac, roles } from "./access-control";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  
  plugins: [
    adminClient({
      ac,
      roles,
    }),
    
    twoFactorClient({
      onTwoFactorRedirect() {
        // Redirect to 2FA verification page
        window.location.href = "/auth/verify-2fa";
      },
    }),
    
    emailOTPClient(),
  ],
});

// Export commonly used methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
