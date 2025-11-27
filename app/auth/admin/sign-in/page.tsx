"use client";

import { Mail, Shield, Loader2, ArrowRight } from "lucide-react";
import FormField from "@/components/forms/FormField";
import OtpInput from "@/components/forms/OtpInput";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
export default function AdminSignInPage() {
  const { state, update, sendOtp, verifyOtp } = useAdminAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600">Secure OTP login</p>
        </div>

        {state.errors.general && (
          <p className="bg-red-50 border-l-4 border-red-600 text-red-700 p-3 mb-4 text-sm rounded">
            {state.errors.general}
          </p>
        )}

        {state.success && (
          <p className="bg-green-50 border-l-4 border-green-600 text-green-700 p-3 mb-4 text-sm rounded">
            {state.success}
          </p>
        )}

        {!state.otpSent ? (
          <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-5">
            <FormField
              label="Admin Email"
              placeholder="please enter your email"
              type="email"
              value={state.email}
              onChange={(v) => update({ email: v })}
              icon={Mail}
              error={state.errors.email}
              helperText="Only admin accounts can access this portal" required autoComplete="email"
              
            />

            <button
              disabled={state.loading}
              className="form-button-primary w-full gap-2"
            >
              {state.loading ? <Loader2 className="animate-spin" /> : <>Send Code <ArrowRight /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); verifyOtp(); }} className="space-y-5">
            <OtpInput
              label="6-digit Code"
              value={state.otp}
              onChange={(v) => update({ otp: v.replace(/\D/g, "") })}
              helperText="Check your email for the verification code"
              error={state.errors.otp}
              autoFocus
            />
            <button
              disabled={state.loading || state.otp.length !== 6}
              className="form-button-primary w-full gap-2"
            >
              {state.loading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
            </button>
            <button type="button" onClick={() => { update({ otpSent: false, otp: "", success: "" }); }} className="w-full text-slate-600 hover:text-slate-800 text-sm font-medium" > ← Change Email </button>
          </form>
        )}
      </div>
    </div>
  );
}



