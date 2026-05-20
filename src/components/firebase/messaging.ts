import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import { app } from "./firebase";

let messagingInstance: Messaging | null = null;

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  try {
    if (typeof window === "undefined") return null;

    const supported = await isSupported();

    if (!supported) {
      console.warn("⚠️ Firebase Messaging NOT supported in this browser");
      return null;
    }

    if (messagingInstance) return messagingInstance;

    const messaging = getMessaging(app);

    messagingInstance = messaging;

    console.log("🔥 Firebase Messaging initialized");

    return messagingInstance;
  } catch (err) {
    console.error("❌ messaging init error:", err);
    return null;
  }
};