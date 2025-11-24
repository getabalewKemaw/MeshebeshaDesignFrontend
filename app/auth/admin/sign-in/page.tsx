"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, Shield, Loader2, ArrowRight } from "lucide-react";
import FormField from "@/components/forms/FormField";
import OtpInput from "@/components/forms/OtpInput";

export default function AdminSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    general: "",
  });

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Enter a valid admin email address";
  const validateOtp = (val: string) =>
    val.length === 6 ? "" : "Enter the 6-digit verification code";

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "", email: "" }));
    setSuccess("");

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || "Failed to send OTP. Please confirm this is an admin email.",
        }));
      } else {
        setOtpSent(true);
        setSuccess("Verification code sent to your email!");
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err instanceof Error ? err.message : "An error occurred",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpError = validateOtp(otp);
    if (otpError) {
      setErrors((prev) => ({ ...prev, otp: otpError }));
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "", otp: "" }));

    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || "Invalid OTP code",
        }));
        return;
      }

      // Check if user has admin role
      const session = await authClient.getSession();
      
      if (!session.data?.user) {
        setErrors((prev) => ({ ...prev, general: "Failed to verify session" }));
        return;
      }

      if (session.data.user.role !== "admin") {
        setErrors((prev) => ({ ...prev, general: "Access denied. Admin privileges required." }));
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
      setErrors((prev) => ({
        ...prev,
        general: err instanceof Error ? err.message : "An error occurred",
      }));
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
        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <p className="text-sm font-medium">{errors.general}</p>
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
            <FormField
              label="Admin Email Address"
              type="email"
              value={email}
              onChange={(val) => {
                setEmail(val);
                setErrors((prev) => ({ ...prev, email: validateEmail(val), general: "" }));
              }}
              placeholder="admin@meshebeshadesign.com"
              icon={Mail}
              error={errors.email}
              helperText="Only admin accounts can access this portal"
              required
              autoComplete="email"
            />

            <button
              type="submit"
              disabled={loading}
              className="form-button-primary w-full gap-2"
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
            <OtpInput
              label="Enter 6-digit verification code"
              value={otp}
              onChange={(val) => {
                const digitsOnly = val.replace(/\D/g, "");
                setOtp(digitsOnly);
                setErrors((prev) => ({ ...prev, otp: "", general: "" }));
              }}
              helperText="Check your email for the verification code"
              error={errors.otp}
              autoFocus
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="form-button-primary w-full gap-2"
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
