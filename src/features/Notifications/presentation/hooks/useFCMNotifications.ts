import { useEffect, useState } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "@/components/firebase/firebase";
type FCMNotificationPayload = {
  messageId?: string;
  data?: Record<string, any>;
  notification?: {
    title?: string;
    body?: string;
  };
};

export function useFCMNotifications() {
  const [latestFCM, setLatestFCM] =
    useState<FCMNotificationPayload | null>(null);
 const messaging = getMessaging(app);
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      setLatestFCM(payload as FCMNotificationPayload);
    });

    return () => unsubscribe();
  }, []);

  return latestFCM;
}