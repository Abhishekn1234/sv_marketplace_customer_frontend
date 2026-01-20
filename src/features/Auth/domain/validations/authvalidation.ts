import type { ForgotPasswordRequest } from "../entities/forgotpasswordrequest";
import type { ResetPasswordRequest } from "../entities/resetpasswordrequest.types";
import type { SendOTPRequest } from "../entities/sendotprequest.types";
import type { OTPRequest } from "../entities/otprequest.types";
import type { RegisterRequest } from "../entities/registerrequest";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

export function validateEmail(email?: string): string {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error("Valid email is required");
  }
  return email.trim().toLowerCase();
}

export function validatePassword(password?: string): string {
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number and special character"
    );
  }

  return password;
}

export function validatePhone(phone?: string): string {
  if (!phone || phone.trim().length < 10) {
    throw new Error("Valid phone number is required");
  }
  return phone.trim();
}

export function validateOTP(otp?: string): string {
  if (!otp || otp.length !== 6) {
    throw new Error("Valid 6-digit OTP is required");
  }
  return otp;
}


export function validateForgotPassword(
  request: ForgotPasswordRequest
): ForgotPasswordRequest {
  return {
    ...request,
    email: validateEmail(request.email),
  };
}

export function validateResetPassword(
  request: ResetPasswordRequest
): ResetPasswordRequest {
  return {
    ...request,
    email: validateEmail(request.email),
    password: validatePassword(request.password),
  };
}

export function validateSendOTP(
  request: SendOTPRequest
): SendOTPRequest {
  return {
    ...request,
    phone: validatePhone(request.phone),
  };
}

export function validateVerifyOTP(
  request: OTPRequest
): OTPRequest {
  return {
    ...request,
    otp: validateOTP(request.otp),
  };
}

export function validateRegister(
  request: RegisterRequest
): RegisterRequest {
  const payload: RegisterRequest = {
    fullName: request.fullName?.trim(),
    email: request.email?.trim().toLowerCase(),
    phone: request.phone?.trim(),
    password: request.password,
  };

  if (!payload.fullName || payload.fullName.length < 2) {
    throw new Error("Full name must be at least 2 characters");
  }

  if (!payload.email || !EMAIL_REGEX.test(payload.email)) {
    throw new Error("Valid email is required");
  }

  if (!payload.phone || payload.phone.length < 10) {
    throw new Error("Valid phone number is required");
  }

  if (!payload.password || payload.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!PASSWORD_REGEX.test(payload.password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number and special character"
    );
  }

  return payload; 
}