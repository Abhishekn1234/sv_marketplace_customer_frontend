import { create } from "zustand";

interface VerificationState {
  step: 1 | 2;
  setStep: (s: 1 | 2) => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  step: 2,
  setStep: (s) => set({ step: s }),
}));