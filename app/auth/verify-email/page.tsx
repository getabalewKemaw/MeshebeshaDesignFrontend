"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import OtpInput from "@/components/forms/OtpInput";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setGeneralError("");
    setOtpError("");

    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      });

      if (error) setGeneralError(error.message || "Invalid OTP code");
      else if (data) router.push("/auth/sign-in");
    } catch (err: unknown) {
      const errMsg=err instanceof Error ? err.message : "An unexpected error occurred";
      setGeneralError(errMsg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setGeneralError("");
    setResendSuccess(false);

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) setGeneralError(error.message || "Failed to resend OTP");
      else {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } catch (err: unknown) {
      const msg= err instanceof Error ? err.message :"an expecetd error occured";
      setGeneralError(msg || "An error occurred");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/ui/8.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
      </div>

      {/* Container */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-8 md:p-10 w-full max-w-md border border-white/20">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-green-100 rounded-full">
            <span className="text-3xl">📧</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
            Verify Your Email
          </h1>
          <p className="text-gray-600 mt-1">Code sent to:</p>
          <p className="text-green-600 font-semibold">{email}</p>
        </div>

        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {generalError}
          </div>
        )}

        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            OTP sent again ✔
          </div>
        )}

        {/* OTP INPUTS */}
        <form onSubmit={handleVerify} className="space-y-6">
          <OtpInput
            label="Enter the verification code"
            value={otp}
            onChange={(val) => {
              const digitsOnly = val.replace(/\D/g, "");
              setOtp(digitsOnly);
              setOtpError("");
            }}
            helperText="Check your email inbox for the 6-digit code"
            error={otpError}
            autoFocus
          />

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="form-button-primary w-full"
          >
            {loading ? "Verifying..." : "Verify Email"}  
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Did n&apos;t receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={resending}
            className="mt-2 text-green-600 font-semibold hover:text-green-700 disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          <a href="/auth/sign-in" className="text-gray-600 hover:underline">
            ← Back to Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
