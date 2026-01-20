import type { UpdateProfileWithFiles } from "../entities/updateprofilewithfiles.types";
import type { UploadDocumentRequest } from "../entities/uploaddocumentrequest.types";


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "application/pdf",
];


export function validateUpdatePassword(
  oldPassword?: string,
  newPassword?: string,
  confirmPassword?: string
) {
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new Error("All fields are required");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!PASSWORD_REGEX.test(newPassword)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number and special character"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  return { oldPassword, newPassword };
}


export function validateUpdateProfile(
  request: UpdateProfileWithFiles
): UpdateProfileWithFiles {
  if (request.fullName && request.fullName.trim().length < 2) {
    throw new Error("Full name must be at least 2 characters");
  }

  if (request.email && !EMAIL_REGEX.test(request.email)) {
    throw new Error("Invalid email format");
  }

  if (request.phone && request.phone.trim().length < 10) {
    throw new Error("Invalid phone number");
  }

  if (request.address && request.address.trim().length < 10) {
    throw new Error("Address must be at least 10 characters");
  }

  return request;
}



export function validateUploadDocument(
  request: UploadDocumentRequest
): UploadDocumentRequest {
  if (!request.file) {
    throw new Error("File is required");
  }

  if (!request.documentType) {
    throw new Error("Document type is required");
  }

  if (request.file.size > MAX_FILE_SIZE) {
    throw new Error("File size must not exceed 5MB");
  }

  if (!ALLOWED_FILE_TYPES.includes(request.file.type)) {
    throw new Error("Invalid file type. Allowed: JPG, PNG, GIF, PDF");
  }

  return request;
}
