import type {
  RegisterRequest,
  RegisterResponse,
} from "../Auth/domain/entities/auth.types";
import { useAuthStore } from "../core/store/auth";
import apiClient from "./interceptor";

export const registerUser = async (
  payload: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload
  );

  const { accessToken, refreshToken, user } = response.data;

  if (accessToken && refreshToken && user) {
    const { setTokens, setUser } = useAuthStore.getState();

    setTokens(accessToken, refreshToken);
    setUser(user);
  }

  return response.data;
};


