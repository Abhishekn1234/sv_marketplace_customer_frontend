import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../Auth/domain/entities/auth.types";
import type { LastLocation } from "../../Auth/domain/entities/lastlocation.types";

export type Theme = "light" | "dark";


export interface UserWithLocation extends User {}

export interface CustomerData {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null
  isLoggedIn: boolean;
  theme: Theme;
   last_location?: LastLocation;
  current_location?: LastLocation;
  language: string;
}
interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
export interface AuthState {
  customerData: CustomerData;
   
  updateUserLocation: (location: LastLocation) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserWithLocation) => void;
  clearAuth: () => void;

  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: string) => void;
updateAddress: (type: "home" | "office" |"other" |"inputValue", value: string) => void;

}

const initialCustomerData: CustomerData = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoggedIn: false,
  theme: "light",
  language: "EN",
  current_location: undefined,
  last_location: undefined,
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

    
      
      updateUserLocation: (newLocation: LastLocation) => {
  set((state) => ({
    customerData: {
      ...state.customerData,
      last_location: state.customerData.current_location, // 👈 previous
      current_location: newLocation,                      // 👈 new
    },
  }));
},
updateAddress: (type: "home" | "office" |"other"|"inputValue", value: string) => {
  set((state) => {
    const current = state.customerData.current_location;

    return {
      customerData: {
        ...state.customerData,
        current_location: {
          id: current?.id,
          home: type === "home" ? value : current?.home || "",
          office: type === "office" ? value : current?.office || "",
          inputValue: type === "inputValue" ? value : current?.inputValue || "",
          other: type === "other" ? value : current?.other || "",
        },
      },
    };
  });
},


    }),
    
    { name: "auth-storage" } // persist to localStorage
  )
);
export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
