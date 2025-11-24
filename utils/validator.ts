export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? ""
    : "Enter a valid admin email address";
export const validateOtp = (otp: string) =>
  otp.length === 6 ? "" : "Enter the 6-digit verification code";



  // Validation functions
  export const validateName = (val: string) =>
    val.trim().length >= 3 ? "" : "Name must be at least 3 characters";

  export const validatePassword = (val: string) =>
    val.length >= 8 ? "" : "Password must be at least 8 characters";

  
 