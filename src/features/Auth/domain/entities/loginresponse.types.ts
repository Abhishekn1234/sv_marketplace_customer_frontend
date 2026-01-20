import type { User } from "./auth.types";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message?:string;
}