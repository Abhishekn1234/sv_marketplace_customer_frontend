export type UpdateProfileWithFiles = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: File;
  idProof?: File;
  addressProof?: File;
  photoProof?: File;
};