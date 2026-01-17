export interface UserProfile {
  _id: string; // matches API
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profilePictureUrl?: string; // matches API
  profilePicturePublicId?: string;
  documents?: Array<{
    type: 'idProof' | 'addressProof' | 'photoProof';
    url: string;
  }>;
  isVerified: boolean;
  kycStatus: string;
  role: {
    _id: string;
    name: string;
    modules: string[];
    createdAt: string;
    updatedAt: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  _id?:string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?:File;
}

// ✅ backend reality
export type UpdateProfileResponse = UserProfile;


export type DocumentType = 'idProof' | 'addressProof' | 'photoProof';

export interface UploadDocumentRequest {
  documentType: DocumentType;
  file: File;
}
export interface UploadDocumentResponse {
  url: string;
  documentType: string;
  message: string;
}


export type GetProfileResponse = UserProfile; // directly the profile
