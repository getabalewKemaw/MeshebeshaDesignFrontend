"use client";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import FormField from "@/components/forms/FormField";
import { authClient } from "@/lib/auth-client";
import OtpInput from "@/components/forms/OtpInput";
import { useOTPAuth } from "@/lib/hooks/useOTPAuth";

export default function SignInPage() {
  const {
    email,
    otp,
    otpSent,
    loading,
    success,
    errors,
    setEmail,
    setOtp,
    setOtpSent,
    handleSendOTP,
    handleOTPSignIn,
  } = useOTPAuth();

  const handleEmailChange = (val: string) => {
    setEmail(val);
    // Clear validation error while typing
    setOtp("");
    setOtpSent(false);
  };

  const handleOtpChange = (val: string) => {
    setOtp(val.replace(/\D/g, ""));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to MeshebeshaDesign</p>
          </div>

          {/* Error */}
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
              <p className="text-sm">{errors.general}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6">
              <p className="text-sm">{success}</p>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <FormField
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email}
                required
                autoComplete="email"
              />
              <button type="submit" disabled={loading} className="form-button-primary w-full gap-2">
                {loading ? <><Loader2 className="h-5 w-5 animate-spin"/> Sending OTP...</> : <>Send OTP <ArrowRight className="h-5 w-5" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSignIn} className="space-y-5">
              <OtpInput
                label="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                helperText="Check your email for the verification code"
                error={errors.otp}
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="form-button-primary w-full gap-2"
              >
                {loading ? <><Loader2 className="h-5 w-5 animate-spin"/> Verifying...</> : "Verify & Sign In"}
              </button>
              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtp(""); }}
                className="w-full text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                ← Back to email
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={async () => await authClient.signIn.social({ provider: "google", callbackURL: `${window.location.origin}/dashboard` })}
            type="button"
            className="form-button-secondary w-full mt-6 gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <div className="mt-8 text-center">
            <a href="/auth/sign-up" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Don’t have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
