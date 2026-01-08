import type { RegisterRequest, RegisterResponse } from "../Auth/domain/entities/auth.types";
import apiClient from "./interceptor";

export const registerUser = async (
  payload: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await apiClient.post("/auth/register", payload);

  // ✅ CORRECT LEVEL
  const { accessToken, refreshToken, user } = response.data.data;

  const customerData = {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isVerified: user.isVerified,
      kycStatus: user.kycStatus,

      profilePictureUrl: user.profilePictureUrl,
      profilePicturePublicId: user.profilePicturePublicId,

      role: user.role,
      documents: user.documents,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
  console.log(customerData);
  localStorage.setItem("customer", JSON.stringify(customerData));

  // ⬅️ return normalized data
  return response.data.data;
};


