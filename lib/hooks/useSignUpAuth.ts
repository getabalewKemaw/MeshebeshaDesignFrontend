"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { validateEmail ,validateName,validatePassword} from "@/utils/validator";

export function useSignUpAuth() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading & errors
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  // Validation functions
//   const validateName = (val: string) =>
//     val.trim().length >= 3 ? "" : "Name must be at least 3 characters";

//   const validatePassword = (val: string) =>
//     val.length >= 8 ? "" : "Password must be at least 8 characters";

  const validateConfirmPassword = (val: string) =>
    val === password ? "" : "Passwords do not match";

  // Form validity check
  const isFormValid =
    name &&
    email &&
    password &&
    confirmPassword &&
    !validateName(name) &&
    !validateEmail(email) &&
    !validatePassword(password) &&
    !validateConfirmPassword(confirmPassword);

  // Submit handler
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: `/auth/verify-email?email=${encodeURIComponent(email)}`,
      });

      if (error) {
        setErrors((prev) => ({ ...prev, general: error.message || "Signup failed" }));
      } else {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (error: unknown) {
      setErrors((prev) => ({
        ...prev,
        general: error instanceof Error ? error.message : "Unexpected error occurred.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    isFormValid,
    handleSubmit,
    handleGoogleSignUp,
    validateName,
    validatePassword,
    validateConfirmPassword,
  };
}
