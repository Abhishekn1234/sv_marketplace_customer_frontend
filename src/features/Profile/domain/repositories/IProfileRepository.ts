import type { GetProfileResponse } from '../entities/getprofileresponse.types';
import type { UploadDocumentResponse } from '../entities/uploaddocumentresponse.types';
import type { UploadDocumentRequest } from '../entities/uploaddocumentrequest.types';
import type { UpdateProfileResponse } from '../entities/updateprofileresponse.types';
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
