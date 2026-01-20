export interface UserProfile {
  _id: string; 
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profilePictureUrl?: string; 
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

