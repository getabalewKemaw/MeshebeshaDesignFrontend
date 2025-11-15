"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Shield, Loader2, ArrowRight } from "lucide-react";

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        setError(error.message || "Failed to send OTP. Please check if this is an admin email.");
      } else {
        setOtpSent(true);
        setSuccess("Verification code sent to your email!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (error) {
        setError(error.message || "Invalid OTP code");
        return;
      }

      // Check if user has admin role
      const session = await authClient.getSession();
      
      if (!session.data?.user) {
        setError("Failed to verify session");
        return;
      }

      if (session.data.user.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        await authClient.signOut();
        return;
      }

      // Check if 2FA is enabled
      if (session.data.user.twoFactorEnabled) {
        // Redirect to 2FA verification
        router.push("/auth/verify-2fa");
      } else {
        // First time admin login - redirect to enable 2FA
        setSuccess("Login successful! Please set up 2FA for security.");
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">
            Secure admin access with OTP verification
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6">
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        {/* Email Form */}
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 transition-colors text-black"
                  placeholder="admin@meshebeshadesign.com"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Only admin accounts can access this portal
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-600 focus:border-slate-600 text-center text-3xl tracking-[0.5em] font-bold transition-colors text-black"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Check your email for the verification code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-slate-800 text-white py-3 px-4 rounded-lg font-semibold hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Verify & Access Admin Portal
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setSuccess("");
              }}
              className="w-full text-slate-600 hover:text-slate-800 text-sm font-medium"
            >
              ← Change Email
            </button>
          </form>
        )}


      </div>
    </div>
  );
}
