// these is  the admin auth state for the admin

export interface AuthState {
  email: string;
  otp: string;
  otpSent: boolean;
  loading: boolean;
  success: string;
  errors: {
    email: string;
    otp: string;
    general: string;
  };
}
export interface User{
  id:string;
  email:string;
  role:"admin" | "user";
  name:string;
  image?:string | null;
  emailVerified:boolean;
  createdAt:Date;
  updatedAt:Date;

}
