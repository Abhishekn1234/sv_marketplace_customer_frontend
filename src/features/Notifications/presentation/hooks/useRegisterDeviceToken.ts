import { useEffect, useMemo, useState } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { RegisterDeviceTokenUseCase } from "../../domain/usecase/RegisterDeveiceTokenUsecase";
import { requestAndGetToken, initOnMessage } from "@/components/firebase/notifications";
import { useAuthStore } from "@/features/core/store/auth";
import { useDeviceStore } from "@/features/core/store/device";
import { useUnregisterDeviceToken } from "./useUnregisterDeviceToken";

export const useRegisterDeviceToken = () => {
  const [fcmNotifications, setFcmNotifications] = useState<any[]>([]);

  const { deviceId, fcmToken, setDeviceId, setFcmToken } = useDeviceStore();
  const { unregisterToken } = useUnregisterDeviceToken();

  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(() => new RegisterDeviceTokenUseCase(repo), [repo]);

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      try {
        /* ✅ 1. Ask permission properly */
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("❌ Notification permission denied");
          return;
        }

        /* ✅ 2. Register service worker */
        if ("serviceWorker" in navigator) {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        }

        /* ✅ 3. Foreground listener (once) */
        initOnMessage(setFcmNotifications);

        /* ✅ 4. Get FCM token */
        const newToken = await requestAndGetToken();
        if (!newToken) return;

        /* ✅ 5. Ensure deviceId */
        let currentDeviceId = deviceId;
        if (!currentDeviceId) {
          currentDeviceId = crypto.randomUUID();
          setDeviceId(currentDeviceId);
        }

        const user = useAuthStore.getState().user;
        const roleId = user?.role?._id;
        if (!roleId) return;

        /* 🔥 CASE 1: First-time register */
        if (!fcmToken) {
          await useCase.execute({
            token: newToken,
            platform: "WEB",
            roleId,
            deviceId: currentDeviceId,
            appId: "sv-marketplace-web",
          });

          if (isMounted) setFcmToken(newToken);
          console.log("✅ Token registered (first time)");
          return;
        }

        /* 🔥 CASE 2: Token changed → unregister old + register new */
        if (fcmToken !== newToken) {
          console.log("🔄 Token changed, re-registering...");

          await unregisterToken(); // remove old token

          await useCase.execute({
            token: newToken,
            platform: "WEB",
            roleId,
            deviceId: currentDeviceId,
            appId: "sv-marketplace-web",
          });

          if (isMounted) setFcmToken(newToken);
          console.log("✅ Token updated");
          return;
        }

        /* ✅ CASE 3: Token same */
        console.log("ℹ️ Token unchanged");
      } catch (err) {
        console.error("❌ Notification setup failed:", err);
      }
    };

    setup();

    return () => {
      isMounted = false;
    };
  }, [useCase]);

  return {
    fcmNotifications,
  };
};