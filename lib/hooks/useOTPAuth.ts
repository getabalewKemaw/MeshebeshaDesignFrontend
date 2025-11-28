"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { validateEmail, validateOtp } from "@/utils/validator";
import { checkEmail, sendOtp, verifyOtp } from "@/services/authServices";
import type { User } from "@/types/auth";

export function useOTPAuth() {
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

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    const emailError = validateEmail(email);

    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }

    setLoading(true);
    setErrors(prev => ({ ...prev, general: "", email: "" }));
    setSuccess("");

    try {
      const data = await checkEmail(email);

      if (!data.exists) {
        setErrors(prev => ({
          ...prev,
          general: "No account found with this email. Please sign up first.",
        }));
        return;
      }

      const { error } = await sendOtp(authClient, email);

      if (error) {
        setErrors(prev => ({ ...prev, general: error.message || "Failed to send OTP" }));
      } else {
        setOtpSent(true);
        setSuccess("OTP sent to your email!");
      }
    } catch (err: unknown) {
      const errMsg=err instanceof Error ? err.message : String(err);
      setErrors(prev => ({ ...prev, general: errMsg || "An error occurred" }));
    } finally {
      setLoading(false);
    }
  }

  async function handleOTPSignIn(e: React.FormEvent) {
    e.preventDefault();
    const otpError = validateOtp(otp);

    if (otpError) {
      setErrors(prev => ({ ...prev, otp: otpError }));
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await verifyOtp(authClient, email, otp);
      if (error) {
        setErrors(prev => ({ ...prev, general: error.message || "Invalid OTP" }));
      } else {
        const user = data?.user as User;
        if (user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return {
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
  };
}
