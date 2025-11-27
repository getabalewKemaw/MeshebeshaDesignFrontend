import { useReducer } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { validateEmail, validateOtp } from "@/utils/validator";
import type { AuthState  } from "@/types/auth";


const initialState: AuthState = {
  email: "",
  otp: "",
  otpSent: false,
  loading: false,
  success: "",
  errors: { email: "", otp: "", general: "" },
};

function reducer(state: AuthState, action: Partial<AuthState>): AuthState {
  return { ...state, ...action };
}

export function useAdminAuth() {
  const [state, update] = useReducer(reducer, initialState);
  const router = useRouter();

  const sendOtp = async () => {
    const emailError = validateEmail(state.email);
    if (emailError) return update({ errors: { ...state.errors, email: emailError } });

    update({ loading: true, success: "", errors: { ...state.errors, general: "" } });

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: state.email,
      type: "sign-in",
    });

    update({
      loading: false,
      otpSent: !error,
      success: error ? "" : "Verification code sent!",
      errors: error ? { ...state.errors, general: error.message } : state.errors,
    });
  };

  const verifyOtp = async () => {
    const otpError = validateOtp(state.otp);
    if (otpError) return update({ errors: { ...state.errors, otp: otpError } });

    update({ loading: true, errors: { ...state.errors, general: "" } });

    const { error } = await authClient.signIn.emailOtp({
      email: state.email,
      otp: state.otp,
    });

    if (error) return update({ loading: false, errors: { ...state.errors, general: error.message } });

    const session = await authClient.getSession();

    if (session.data?.user.role !== "admin") {
      await authClient.signOut();
      return update({ loading: false, errors: { ...state.errors, general: "Access denied." } });
    }

    update({ loading: false, success: "Login successful!" });

    setTimeout(() => {
      router.push(session.data?.user.twoFactorEnabled ? "/auth/verify-2fa" : "/admin");
    }, 500);
  };

  return {
    state,
    update, // controlled inputs convenience
    sendOtp,
    verifyOtp,
  };
}
