import { authClient } from "@/lib/auth-client";
export async function checkEmail(email: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return response.json();
}

export async function sendOtp(authClient: any, email: string) {
  return authClient.emailOtp.sendVerificationOtp({
    email,
    type: "sign-in",
  });
}

export async function verifyOtp(authClient: any, email: string, otp: string) {
  return authClient.signIn.emailOtp({
    email,
    otp,
  });
}
