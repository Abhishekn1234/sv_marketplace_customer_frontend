import React, { createContext, useContext } from "react";
import { useProfile as useProfileHook } from "../features/hooks/useProfile"

const ProfileContext = createContext<ReturnType<typeof useProfileHook> | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const profile = useProfileHook();
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return ctx;
};
