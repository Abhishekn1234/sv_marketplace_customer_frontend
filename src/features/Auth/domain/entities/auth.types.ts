/* =======================
   AUTH REQUEST TYPES
======================= */

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}



export interface SendOTPRequest {
  phone: string;
}
export interface ForgotPasswordResponse {
  hash: string;      // <-- add this
  message?: string;  // optional
}
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string; // must be "password" not "newPassword"
}


/* =======================
   AUTH RESPONSE TYPES
======================= */

export interface Role {
  name: string;
  modules: any[]; // replace with Module[] if you have it
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;

  address?: string;
  isVerified: boolean;
  kycStatus: string;

  profilePictureUrl?: string;
  profilePicturePublicId?: string;

  role: Role;
  documents: any[];

  createdAt: string;
  updatedAt: string;
}

// types/auth.types.ts

export interface RegisterResponse {
  success: boolean;
  message: string;
  
    accessToken: string;
    refreshToken: string;
    user: {
      _id: string;
      fullName: string;
      email: string;
      phone: string;
      address?: string;
      isVerified: boolean;
      kycStatus?: string;
      profilePictureUrl?: string;
      profilePicturePublicId?: string;
      role: any;
      documents?: any[];
      createdAt: string;
      updatedAt: string;
    };
  
}


export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message?:string;
}

export interface OTPRequest {

  hash: string; // from forgotPassword response
  otp: string;  // 6-digit code user enters
   
}

export interface OTPResponse {
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export interface SendOTPResponse {
  message: string;
  expiresIn: number;
}
