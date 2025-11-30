export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? ""
    : "Enter a valid  email address";
export const validateOtp = (otp: string) =>
  otp.length === 6 ? "" : "Enter the 6-digit verification code";



  // Validation functions
  export const validateName = (val: string) =>
    val.trim().length >= 3 ? "" : "Name must be at least 3 characters";

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=<>?,.{}[\]~]{6,}$/;

export const validatePassword = (val: string) =>
  passwordRegex.test(val) ? "" : "Password must be at least 6 characters and include letters and numbers";