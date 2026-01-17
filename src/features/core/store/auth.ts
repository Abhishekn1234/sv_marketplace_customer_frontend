import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User as APIUser } from "../../Auth/domain/entities/auth.types";

export type Theme = "light" | "dark";

export interface CustomerData {
  accessToken: string | null;
  refreshToken: string | null;
  user: APIUser | null;
  isLoggedIn: boolean;
  theme: Theme;
  language: string;
}

export interface AuthState {
  customerData: CustomerData;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: APIUser) => void;
  clearAuth: () => void;

  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: string) => void;
}

const initialCustomerData: CustomerData = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoggedIn: false,
  theme: "light",
  language: "EN",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customerData: initialCustomerData,

      setTokens: (accessToken, refreshToken) =>
        set({
          customerData: {
            ...get().customerData,
            accessToken,
            refreshToken,
            isLoggedIn: true,
          },
        }),

      setUser: (user) =>
        set({
          customerData: {
            ...get().customerData,
            user,
            isLoggedIn: true,
          },
        }),

      clearAuth: () =>
        set({
          customerData: initialCustomerData,
        }),

      toggleTheme: () => {
        const { theme } = get().customerData;
        set({
          customerData: {
            ...get().customerData,
            theme: theme === "light" ? "dark" : "light",
          },
        });
      },

      setTheme: (theme) =>
        set({
          customerData: {
            ...get().customerData,
            theme,
          },
        }),

      setLanguage: (language) =>
        set({
          customerData: {
            ...get().customerData,
            language,
          },
        }),
    }),
    { name: "auth-storage" }
  )
);
