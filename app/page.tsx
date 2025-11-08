"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/sign-in");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to MeshebeshaDesign 🎨
            </h1>
            <p className="text-xl text-white/90">
              Your creative journey starts here
            </p>
          </div>

          {/* Auth Status Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            {isAuthenticated && user ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Hello, {user.name}! 👋
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        👑 Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Account Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Role:</span>
                      <span className="ml-2 font-medium text-gray-800">
                        {user.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email Verified:</span>
                      <span className="ml-2 font-medium text-gray-800">
                        {user.emailVerified ? "✅ Yes" : "❌ No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Get Started Today
                </h2>
                <p className="text-gray-600 mb-6">
                  Sign in or create an account to access all features
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.push("/auth/sign-in")}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push("/auth/sign-up")}
                    className="px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
              <p className="text-white/80">
                Email OTP verification and optional 2FA for enhanced security
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Fast & Reliable</h3>
              <p className="text-white/80">
                Built with Next.js and Better Auth for optimal performance
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Beautiful Design</h3>
              <p className="text-white/80">
                Modern UI with smooth animations and responsive layout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}