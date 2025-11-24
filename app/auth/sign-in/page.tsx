"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import FormField from "@/components/forms/FormField";
import OtpInput from "@/components/forms/OtpInput";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    general: "",
  });

  const validateEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Enter a valid email address";
  const validateOtp = (val: string) =>
    val.length === 6 ? "" : "Enter the 6-digit code we sent you";


  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // First, check if user exists
      const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        setErrors((prev) => ({
          ...prev,
          general: "No account found with this email. Please sign up first.",
        }));
        setLoading(false);
        return;
      }

      // If user exists, send OTP
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message || "Failed to send OTP",
        }));
      } else {
        setOtpSent(true);
        setSuccess("OTP sent to your email!");
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

  const handleOTPSignIn = async (e: React.FormEvent) => {
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
          general: error.message || "Invalid OTP",
        }));
      } else {
        router.push("/dashboard");
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

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to MeshebeshaDesign
            </p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              <p className="text-sm">{errors.general}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6">
              <p className="text-sm">{success}</p>
            </div>
          )}

          {/* Email + OTP Form */}
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <FormField
                label="Email Address"
                type="email"
                value={email}
                onChange={(val) => {
                  setEmail(val);
                  setErrors((prev) => ({ ...prev, email: validateEmail(val), general: "" }));
                }}
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email}
                required
                autoComplete="email"
                // className="pl-10"
              />

              <button
                type="submit"
                disabled={loading}
                className="form-button-primary w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSignIn} className="space-y-5">
              <OtpInput
                label="Enter 6-digit OTP"
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
                  "Verify & Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setSuccess("");
                }}
                className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                ← Back to email
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
              </div>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="form-button-secondary w-full mt-6 gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Admin Link */}
          <div className="mt-8 text-center">
            <a 
              href="/auth/sign-up" 
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
            Don not have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


