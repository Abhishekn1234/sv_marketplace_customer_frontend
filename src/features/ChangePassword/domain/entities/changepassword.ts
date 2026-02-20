export interface UpdatePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
}