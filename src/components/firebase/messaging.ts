// src/components/firebase/messaging.ts

import { getMessaging, isSupported } from "firebase/messaging";
import app from "./firebase";

export const getFirebaseMessaging = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getMessaging(app);
  }
  return null;
};