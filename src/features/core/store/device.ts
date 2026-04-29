import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DeviceState {
  deviceId: string | null;
  fcmToken: string | null;

  setDeviceId: (id: string) => void;
  setFcmToken: (token: string) => void;

  clearDevice: () => void;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      deviceId: null,
      fcmToken: null,

      setDeviceId: (id: string) => set({ deviceId: id }),
      setFcmToken: (token: string) => set({ fcmToken: token }),

      clearDevice: () => set({ deviceId: null, fcmToken: null }),
    }),
    {
      name: "device-storage", // saved in localStorage automatically
    }
  )
);