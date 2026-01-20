export interface UpdateProfileRequest {
  _id?:string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?:File;
}