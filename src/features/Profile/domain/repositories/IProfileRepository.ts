import type {
  UserProfile,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadDocumentRequest,
  UploadDocumentResponse,
  GetProfileResponse,
} from '../entities/profile.types';

export interface IProfileRepository {
  updatePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }>;
  getProfile(): Promise<GetProfileResponse>;
 updateProfile(
    formData: FormData
  ): Promise<UpdateProfileResponse>;
  uploadDocument(request: UploadDocumentRequest): Promise<UploadDocumentResponse>;
  deleteDocument(documentType: string): Promise<{ message: string }>;
}
