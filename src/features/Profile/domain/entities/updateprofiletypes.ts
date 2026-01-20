import type { UpdateProfileRequest } from "./updateprofilerequest.types";

export type UpdateProfileRequestWithFiles = UpdateProfileRequest & {
  profileImage?: File;
  idProof?: File;
  addressProof?: File;
  photoProof?: File;
};
