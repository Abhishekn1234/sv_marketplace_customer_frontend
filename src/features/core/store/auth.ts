import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../../Auth/domain/entities/auth.types";
import type { LastLocations,Address } from "@/features/Auth/presentation/components/Location/domain/entities/updatelocation";


export type Theme = "light" | "dark";
interface SearchState { searchTerm: string; setSearchTerm: (term: string) => void; }
export interface CustomerData {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoggedIn: boolean;
  theme: Theme;
  last_location?: LastLocations;
  current_location?: LastLocations;
  language: string;
}

export interface AuthState {
  customerData: CustomerData;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;

  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: string) => void;

  updateUserLocation: (location: LastLocations) => void;

  addAddress: (type: "home" | "office"|"inputValue"|"other", value: string) => void;
  updateAddress: (id: string, value: string) => void;
  updateHome:(type:"home"|"office",value: string)=>void;
  deleteAddress: (id: string) => void;
}

const initialCustomerData: CustomerData = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoggedIn: false,
  theme: "light",
  language: "EN",
  current_location: { addresses: [] },
  last_location: undefined,
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

     updateUserLocation: (payload) =>
  set((state) => ({
    customerData: {
      ...state.customerData,
      current_location: {
        addresses: payload.addresses,
      },
    },
  })),
      // ✅ ADD
      addAddress: (type, value) =>
        set((state) => {
          const current = state.customerData.current_location ?? { addresses: [] };

          const newAddress: Address = {
            id: Date.now().toString(),
            type,
            value,
          };

          return {
            customerData: {
              ...state.customerData,
              current_location: {
                ...current,
                addresses: [...current.addresses, newAddress],
              },
            },
          };
        }),

      // ✅ UPDATE
      updateHome: (type: "home" | "office", value: string) =>
  set((state) => {
    const current = state.customerData.current_location ?? { addresses: [] };

    const index = current.addresses.findIndex((addr) => addr.type === type);

    let updatedAddresses;

    if (index !== -1) {
      // Update existing address
      updatedAddresses = current.addresses.map((addr) =>
        addr.type === type ? { ...addr, value } : addr
      );
    } else {
      // If address of this type doesn't exist, add it
      updatedAddresses = [
        ...current.addresses,
        { id: Date.now().toString(), type, value },
      ];
    }

    return {
      customerData: {
        ...state.customerData,
        current_location: {
          ...current,
          addresses: updatedAddresses,
        },
      },
    };
  }),
     updateAddress: (type, value) =>
  set((state) => {
    const current = state.customerData.current_location;
    if (!current) return state;

    return {
      customerData: {
        ...state.customerData,
        current_location: {
          ...current,
          addresses: current.addresses.map((addr) =>
            addr.type === type ? { ...addr, value } : addr
          ),
        },
      },
    };
  }),

      // ✅ DELETE
      deleteAddress: (id) =>
        set((state) => {
          const current = state.customerData.current_location;
          if (!current) return state;

          return {
            customerData: {
              ...state.customerData,
              current_location: {
                ...current,
                addresses: current.addresses.filter(
                  (addr) => addr.id !== id
                ),
              },
            },
          };
        }),
    }),
    { name: "auth-storage" }
  )
);
export const useSearchStore = create<SearchState>((set) => ({ searchTerm: "", setSearchTerm: (term) => set({ searchTerm: term }), }));