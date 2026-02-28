import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../Auth/domain/entities/auth.types";
import type { LastLocations, Address } from "@/features/Auth/presentation/components/Location/domain/entities/updatelocation";

export type Theme = "light" | "dark";

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoggedIn: boolean;
  theme: Theme;
  last_location?: LastLocations;
  current_location: LastLocations;
  language: string;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;

  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: string) => void;

  updateUserLocation: (location: LastLocations) => void;

  addAddress: (type: "home" | "office" | "inputValue" | "other", value: string) => void;
  updateAddress: (id: string, value: string) => void;
  updateHome: (type: "home" | "office", value: string) => void;
  deleteAddress: (id: string) => void;
}

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoggedIn: false,
  theme: "light" as Theme,
  language: "EN",
  current_location: { addresses: [] },
  last_location: undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isLoggedIn: true }),

      setUser: (user) =>
        set({ user, isLoggedIn: true }),

      clearAuth: () => set(initialState),

      toggleTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),

      setTheme: (theme) => set({ theme }),

      setLanguage: (language) => set({ language }),

      updateUserLocation: (payload) =>
        set({
          current_location: {
            addresses: payload.addresses,
          },
        }),

      addAddress: (type, value) =>
        set((state) => {
          const newAddress: Address = {
            id: Date.now().toString(),
            type,
            value,
          };

          return {
            current_location: {
              ...state.current_location,
              addresses: [...state.current_location.addresses, newAddress],
            },
          };
        }),

      updateHome: (type, value) =>
        set((state) => {
          const index = state.current_location.addresses.findIndex(
            (addr) => addr.type === type
          );

          let updatedAddresses;

          if (index !== -1) {
            updatedAddresses = state.current_location.addresses.map((addr) =>
              addr.type === type ? { ...addr, value } : addr
            );
          } else {
            updatedAddresses = [
              ...state.current_location.addresses,
              { id: Date.now().toString(), type, value },
            ];
          }

          return {
            current_location: {
              ...state.current_location,
              addresses: updatedAddresses,
            },
          };
        }),

      updateAddress: (id, value) =>
        set((state) => ({
          current_location: {
            ...state.current_location,
            addresses: state.current_location.addresses.map((addr) =>
              addr.id === id ? { ...addr, value } : addr
            ),
          },
        })),

      deleteAddress: (id) =>
        set((state) => ({
          current_location: {
            ...state.current_location,
            addresses: state.current_location.addresses.filter(
              (addr) => addr.id !== id
            ),
          },
        })),
    }),
    { name: "auth-storage" }
  )
);

export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));