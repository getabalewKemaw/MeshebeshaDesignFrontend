"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import OtpInput from "@/components/forms/OtpInput";

export default function Verify2FAPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [otpError, setOtpError] = useState("");

  // handle the otp length is 6 digits long
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setOtpError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setLoading(true);
    setGeneralError("");
    setOtpError("");

    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code,
        trustDevice,
      });

      if (error) {
        setGeneralError(error.message || "Invalid code");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setGeneralError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600">
            Enter the code from your authenticator app
          </p>
        </div>

        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <OtpInput
            label="Authentication Code"
            value={code}
            onChange={(val) => {
              const digitsOnly = val.replace(/\D/g, "");
              setCode(digitsOnly);
              setOtpError("");
            }}
            error={otpError}
            helperText="Enter the code from your authenticator app"
            autoFocus
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="trustDevice"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="trustDevice" className="ml-2 text-sm text-gray-700">
              Trust this device for 60 days
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="form-button-primary w-full"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/auth/sign-in"
            className="text-sm text-purple-600 hover:text-purple-700 underline"
          >
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}
