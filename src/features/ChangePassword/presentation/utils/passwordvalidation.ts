export interface PasswordValidationResult {
  isValid: boolean;
  message?: string;
}

export const validatePassword = (
  oldPassword: string,
  newPassword: string,
  confirmPassword?: string
): PasswordValidationResult => {

  if (!newPassword) {
    return { isValid: false, message: "Password is required" };
  }

  if (newPassword.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }

  if (!/[A-Z]/.test(newPassword)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }

  if (!/[0-9]/.test(newPassword)) {
    return { isValid: false, message: "Password must contain at least one number" };
  }

  if (!/[^A-Za-z0-9]/.test(newPassword)) {
    return { isValid: false, message: "Password must contain at least one special character" };
  }

  if (confirmPassword !== undefined && newPassword !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }

  if (oldPassword && oldPassword === newPassword) {
    return { isValid: false, message: "New password must be different from current password" };
  }

  return { isValid: true };
};