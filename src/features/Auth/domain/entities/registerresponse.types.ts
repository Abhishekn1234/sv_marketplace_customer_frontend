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