// apiClient.ts
import axios, {
 type  AxiosInstance,
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { apiUrl } from "./apiConfig";

/* ------------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------------ */

interface InternalAxiosRequestConfigWithMetadata
  extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
  _retry?: boolean;
}

interface CustomerData {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

/* ------------------------------------------------------------------ */
/* AXIOS INSTANCE (❗ NO GLOBAL CONTENT-TYPE ❗) */
/* ------------------------------------------------------------------ */

const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
});

/* ------------------------------------------------------------------ */
/* TOKEN REFRESH QUEUE */
/* ------------------------------------------------------------------ */

let isRefreshing = false;

let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
  config: InternalAxiosRequestConfigWithMetadata;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] =
        `Bearer ${token}`;
      resolve(apiClient(config));
    }
  });
  failedQueue = [];
};

/* ------------------------------------------------------------------ */
/* REQUEST INTERCEPTOR */
/* ------------------------------------------------------------------ */

apiClient.interceptors.request.use(
  (
    config: InternalAxiosRequestConfigWithMetadata
  ): InternalAxiosRequestConfigWithMetadata => {
    const customerDataRaw = localStorage.getItem("customerData");

    if (customerDataRaw) {
      try {
        const parsed: CustomerData = JSON.parse(customerDataRaw);
        if (parsed.accessToken) {
          config.headers = config.headers ?? {};
          (config.headers as Record<string, string>)["Authorization"] =
            `Bearer ${parsed.accessToken}`;
        }
      } catch {}
    }

    // 🔥 IMPORTANT PART (JSON vs FormData)
    if (config.data instanceof FormData) {
      // ❌ Let browser set multipart boundary
      delete (config.headers as any)?.["Content-Type"];
    } else {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Content-Type"] =
        "application/json";
    }

    config.metadata = { startTime: Date.now() };
    return config;
  },
  error => Promise.reject(error)
);

/* ------------------------------------------------------------------ */
/* RESPONSE INTERCEPTOR */
/* ------------------------------------------------------------------ */

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as InternalAxiosRequestConfigWithMetadata;
    const duration = Date.now() - (config.metadata?.startTime ?? 0);

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

    /* ---------------- 401 TOKEN REFRESH ---------------- */

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const customerDataRaw = localStorage.getItem("customerData");
      if (!customerDataRaw) return Promise.reject(error);

      const customerData: CustomerData = JSON.parse(customerDataRaw);
      const refreshToken = customerData.refreshToken;

      if (!refreshToken) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${apiUrl}auth/refresh-token`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem(
          "customerData",
          JSON.stringify({
            ...customerData,
            accessToken: newAccessToken,
          })
        );

        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as Record<string, string>)["Authorization"] =
          `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    /* ---------------- ERROR HANDLING ---------------- */

    if (error.response) {
      const { status, data } = error.response;
      const message =
        (data as any)?.message || "Something went wrong";

      switch (status) {
        case 400:
          toast.error(message || "Bad request");
          break;
        case 403:
          toast.error("Access forbidden");
          break;
        case 404:
          toast.error(message || "Not found");
          break;
        case 422:
          toast.error(message || "Validation error");
          break;
        case 429:
          toast.error("Too many requests");
          break;
        case 500:
          toast.error("Server error");
          break;
        case 503:
          toast.error("Service unavailable");
          break;
        default:
          toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

/* ------------------------------------------------------------------ */
/* PUBLIC CLIENT (NO AUTH) */
/* ------------------------------------------------------------------ */

export const publicApiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
