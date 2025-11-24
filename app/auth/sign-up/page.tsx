"use client";

import FormField from "@/components/forms/FormField";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { useSignUpAuth } from "@/lib/hooks/useSignUpAuth";
export default function SignUpPage() {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    errors, loading, isFormValid,
    handleSubmit, handleGoogleSignUp,
    validateName, validatePassword, validateConfirmPassword
  } = useSignUpAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-pink-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Create Account</h1>
            <p className="text-gray-600">Join MeshebeshaDesign today</p>
          </div>

          {/* Global Error */}
          {errors.general && (
            <div className="bg-red-100 text-red-700 p-3 border-l-4 border-red-600 mb-6">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            <FormField
              label="Full Name"
              value={name}
              onChange={(val) => { setName(val);  errors.name = validateName(val); }}
              placeholder="John Doe"
              icon={User}
              error={errors.name}
              required
            />
            <FormField
              label="Email Address"
              type="email"
              value={email}
              onChange={(val) => { setEmail(val); errors.email = ""; }}
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email}
              required
            />
            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={(val) => { setPassword(val); errors.password = validatePassword(val); }}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              required
              canTogglePassword
            />
            <FormField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(val) => { setConfirmPassword(val); errors.confirmPassword = validateConfirmPassword(val); }}
              placeholder="Repeat password"
              icon={Lock}
              error={errors.confirmPassword}
              required
              canTogglePassword
            />

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="form-button-primary w-full"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Create Account"}
            </button>
          </form>

          <button
            onClick={handleGoogleSignUp}
            type="button"
            className="form-button-secondary w-full mt-6 gap-3"
          >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {/* Google SVG */}
            Sign up with Google
          </button>

          <p className="mt-6 text-center text-sm">
            Already have an account? <a href="/auth/sign-in" className="text-purple-700 font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
