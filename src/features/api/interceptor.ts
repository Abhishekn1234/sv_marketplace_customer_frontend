import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { apiUrl } from "./apiConfig";
import { useAuthStore } from "../core/store/auth";

interface InternalAxiosRequestConfigWithMetadata
  extends InternalAxiosRequestConfig {
  metadata?: { startTime: number };
  _retry?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
  config: InternalAxiosRequestConfigWithMetadata;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) reject(error);
    else if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] =
        `Bearer ${token}`;
      resolve(apiClient(config));
    }
  });
  failedQueue = [];
};

/* ---------------- REQUEST INTERCEPTOR ---------------- */

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfigWithMetadata) => {
    const { accessToken } = useAuthStore.getState();
 

    if (accessToken) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] =
        `Bearer ${accessToken}`;
    }

    if (config.data instanceof FormData) {
      delete (config.headers as any)?.["Content-Type"];
    } else {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Content-Type"] =
        "application/json";
    }

    config.metadata = { startTime: Date.now() };
    return config;
  }
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */

apiClient.interceptors.response.use(
  (response) => {
    const config =
      response.config as InternalAxiosRequestConfigWithMetadata;
    const duration =
      Date.now() - (config.metadata?.startTime ?? 0);

    console.log("✅ API RESPONSE", {
      method: config.method,
      url: config.url,
      status: response.status,
      duration: `${duration}ms`,
    });

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfigWithMetadata;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const {
      refreshToken,
        setTokens,
        clearAuth,
      } = useAuthStore.getState();

   
      if (!refreshToken) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          })
        );
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${apiUrl}/auth/refresh-token`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken =
          refreshResponse.data.accessToken;
        const newRefreshToken =
          refreshResponse.data.refreshToken;

        setTokens(newAccessToken, newRefreshToken);

        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      const message =
        (error.response.data as any)?.message ||
        "Something went wrong";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

/* ---------------- PUBLIC CLIENT ---------------- */

export const publicApiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
