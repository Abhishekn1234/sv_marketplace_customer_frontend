import { getMessaging, isSupported } from "firebase/messaging";
import { app } from "./firebase";

let messagingInstance: any = null;

export const getFirebaseMessaging = async () => {
  try {
    if (typeof window === "undefined") return null;

    const supported = await isSupported();
    console.log("🔥 Firebase Messaging supported:", supported);

    if (!supported) return null;

    if (messagingInstance) return messagingInstance;

    messagingInstance = getMessaging(app);

    console.log("🔥 Messaging initialized:", messagingInstance);

    return messagingInstance;
  } catch (err) {
    console.error("❌ messaging init error:", err);
    return null;
  }
};