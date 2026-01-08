import apiClient from '../../../api/interceptor';
import type { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import  type {
  UserProfile,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadDocumentRequest,
  UploadDocumentResponse,
  GetProfileResponse,
} from '../../domain/entities/profile.types';
import { apiUrl } from '../../../api/apiConfig';

export class ProfileRepository implements IProfileRepository {
  private readonly baseUrl = apiUrl;

  async getProfile(): Promise<GetProfileResponse> {
  try {
    const response = await apiClient.get<GetProfileResponse>('/user/me');
    console.log(response.data);

    // The API returns profile directly, so return data directly
    return response.data; 
  } catch (error: any) {
    console.error('Failed to fetch profile:', error);
    throw new Error(error?.response?.data?.message || 'Failed to fetch profile');
  }
}

  async updateProfile(
  formData: FormData
): Promise<UpdateProfileResponse> {
  const response = await apiClient.put<UpdateProfileResponse>(
    `${this.baseUrl}user/update-profile`,
    formData
  );
  console.log(response.data);
  return response.data;
}


  // -------------------------------
  // Update password
  // -------------------------------
  async updatePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(
      `${this.baseUrl}user/update-password`,
      { oldPassword, newPassword },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return response.data;
  }

  // -------------------------------
  // Upload a single document (optional helper)
  // -------------------------------
 async uploadDocument(
  request: UploadDocumentRequest
): Promise<UploadDocumentResponse> {
  const formData = new FormData();

  // 🔥 documentType decides the field name
  formData.append(request.documentType, request.file);

  const response = await apiClient.put<UploadDocumentResponse>(
    `${this.baseUrl}user/update-profile`,
    formData
  );

  return response.data;
}


  // -------------------------------
  // Delete a document
  // -------------------------------
  async deleteDocument(documentType: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `${this.baseUrl}/document/${documentType}`
    );
    return response.data;
  }
}

export default new ProfileRepository();
