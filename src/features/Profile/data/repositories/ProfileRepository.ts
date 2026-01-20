import apiClient from "../../../api/interceptor";
import type { IProfileRepository } from "../../domain/repositories/IProfileRepository";
import type { GetProfileResponse } from "../../domain/entities/getprofileresponse.types";
import type { UploadDocumentResponse } from "../../domain/entities/uploaddocumentresponse.types";
import type { UpdateProfileResponse } from "../../domain/entities/updateprofileresponse.types";
import type { UploadDocumentRequest } from "../../domain/entities/uploaddocumentrequest.types";
import { apiUrl } from "../../../api/apiConfig";
import { useAuthStore } from "../../../core/store/auth";

export class ProfileRepository implements IProfileRepository {
  private readonly baseUrl = apiUrl;

 

  async getProfile(): Promise<GetProfileResponse> {
    try {
      const response = await apiClient.get<GetProfileResponse>("/user/me");

      const { customerData, setUser } = useAuthStore.getState();

      if (customerData.user && response.data) {
        setUser({
          ...customerData.user,
          ...response.data, 
        });
      }

      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch profile:", error);
      throw new Error(
        error?.response?.data?.message || "Failed to fetch profile"
      );
    }
  }

  

  async updateProfile(
    formData: FormData
  ): Promise<UpdateProfileResponse> {
    const response = await apiClient.put<UpdateProfileResponse>(
      `${this.baseUrl}/user/update-profile`,
      formData
    );

    const { customerData, setUser } = useAuthStore.getState();

    if (customerData.user && response.data) {
      setUser({
        ...customerData.user,
        ...response.data,
      });
    }

    return response.data;
  }

  

  async updatePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(
      `${this.baseUrl}/user/update-password`,
      { oldPassword, newPassword },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  }



  async uploadDocument(
    request: UploadDocumentRequest
  ): Promise<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append(request.documentType, request.file);

    const response = await apiClient.put<UploadDocumentResponse>(
      `${this.baseUrl}/user/update-profile`,
      formData
    );

    const { customerData, setUser } = useAuthStore.getState();

    if (customerData.user) {
      setUser({
        ...customerData.user,
        documents: [
          ...(customerData.user.documents || []),
          response.data.documentType,
        ],
      });
    }

    return response.data;
  }



  async deleteDocument(
    documentType: string
  ): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(
      `${this.baseUrl}/document/${documentType}`
    );

    const { customerData, setUser } = useAuthStore.getState();

    if (customerData.user) {
      setUser({
        ...customerData.user,
        documents: (customerData.user.documents || []).filter(
          (doc: any) => doc.type !== documentType
        ),
      });
    }

    return response.data;
  }
}

export default new ProfileRepository();
