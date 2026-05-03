import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../Auth/domain/entities/auth.types";
import type {
  LastLocations,
  Address,
} from "@/features/Auth/presentation/components/Location/domain/entities/updatelocation";
import { initializeSocket, disconnectSocket } from "../Websocket/socket";

export type Theme = "light" | "dark";

/* ---------------- SEARCH STATE (if still needed separately) ---------------- */
interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

/* ---------------- AUTH STATE ---------------- */
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoggedIn: boolean;
  theme: Theme;
  last_location?: LastLocations;
  current_location: LastLocations;
  language: string;

  mobileForVerification?: string;
  setMobileForVerification: (phone: string) => void;

  /* ---------------- NOTIFICATIONS ---------------- */
  notifications: {
    searchTerm: string;
    unreadCount: number;
  };

  setSearchTerm: (term: string) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  resetUnread: () => void;

  /* ---------------- AUTH ACTIONS ---------------- */
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;

  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: string) => void;

  updateUserLocation: (location: LastLocations) => void;

  addAddress: (
    type: "home" | "office" | "inputValue" | "other",
    value: string
  ) => void;

  updateAddress: (id: string, value: string, lat: number, lng: number) => void;

  updateHome: (
    type: "home" | "office" | "inputValue",
    value: string
  ) => void;

  deleteAddress: (id: string) => void;
}

/* ---------------- INITIAL STATE ---------------- */
const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoggedIn: false,
  theme: "light" as Theme,
  language: "en",
  current_location: { addresses: [] },
  last_location: undefined,

  notifications: {
    searchTerm: "",
    unreadCount: 0,
  },
};

/* ---------------- STORE ---------------- */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /* ---------------- AUTH ---------------- */
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isLoggedIn: true });

        if (accessToken) {
          initializeSocket(accessToken);
        }
      },

      setUser: (user) => set({ user, isLoggedIn: true }),

      clearAuth: () => {
        disconnectSocket();
        set(initialState);
      },

      /* ---------------- THEME ---------------- */
      toggleTheme: () =>
        set({ theme: get().theme === "light" ? "dark" : "light" }),

      setTheme: (theme) => set({ theme }),

      setLanguage: (language) => set({ language }),

      /* ---------------- LOCATION ---------------- */
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
              addresses: [
                ...state.current_location.addresses,
                newAddress,
              ],
            },
          };
        }),

      updateHome: (type, value) =>
        set((state) => {
          const exists = state.current_location.addresses.some(
            (addr) => addr.type === type
          );

          const updatedAddresses = exists
            ? state.current_location.addresses.map((addr) =>
                addr.type === type ? { ...addr, value } : addr
              )
            : [
                ...state.current_location.addresses,
                {
                  id: Date.now().toString(),
                  type,
                  value,
                },
              ];

          return {
            current_location: {
              ...state.current_location,
              addresses: updatedAddresses,
            },
          };
        }),

      updateAddress: (id, value, lat, lng) =>
        set((state) => ({
          current_location: {
            ...state.current_location,
            addresses: state.current_location.addresses.map((addr) =>
              addr.id === id ? { ...addr, value, lat, lng } : addr
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

      setMobileForVerification: (phone: string) =>
        set({ mobileForVerification: phone }),

      /* ---------------- NOTIFICATIONS (FIXED) ---------------- */
      setSearchTerm: (term) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            searchTerm: term,
          },
        })),

      setUnreadCount: (count) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            unreadCount: count,
          },
        })),

      incrementUnread: () =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            unreadCount: state.notifications.unreadCount + 1,
          },
        })),

      decrementUnread: () =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            unreadCount: Math.max(
              0,
              state.notifications.unreadCount - 1
            ),
          },
        })),

      resetUnread: () =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            unreadCount: 0,
          },
        })),
    }),
    {
      name: "customer-storage",
    }
  )
);

/* ---------------- OPTIONAL SEARCH STORE (keep if needed) ---------------- */
export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));