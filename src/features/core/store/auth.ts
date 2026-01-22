import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../Auth/domain/entities/auth.types";
import type { LastLocation } from "../../Auth/domain/entities/lastlocation.types";

export type Theme = "light" | "dark";


export interface UserWithLocation extends User {
  last_location?: LastLocation;
  current_location?: LastLocation;
}

export interface CustomerData {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserWithLocation | null;
  isLoggedIn: boolean;
  theme: Theme;
  language: string;
}

export interface AuthState {
  customerData: CustomerData;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserWithLocation) => void;
  clearAuth: () => void;

  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: string) => void;
  updateUserLastLocation: (current: LastLocation) => void;
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

      // Set access & refresh tokens
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

      // Clear all auth data
      clearAuth: () =>
        set({
          customerData: initialCustomerData,
        }),

      // Toggle theme
      toggleTheme: () => {
        const { theme } = get().customerData;
        set({
          customerData: {
            ...get().customerData,
            theme: theme === "light" ? "dark" : "light",
          },
        });
      },

      // Set specific theme
      setTheme: (theme) =>
        set({
          customerData: {
            ...get().customerData,
            theme,
          },
        }),

      // Set language
      setLanguage: (language) =>
        set({
          customerData: {
            ...get().customerData,
            language,
          },
        }),

      // Update user location: last_location = previous current_location
      updateUserLastLocation: (current: LastLocation) => {
        const user = get().customerData.user;
        if (!user) return;

        const previous: LastLocation | undefined = user.current_location;

        set({
          customerData: {
            ...get().customerData,
            user: {
              ...user,
              last_location: previous,   // previous location
              current_location: current, // new current location
            },
          },
        });
      },
    }),
    { name: "auth-storage" } // persist to localStorage
  )
);
