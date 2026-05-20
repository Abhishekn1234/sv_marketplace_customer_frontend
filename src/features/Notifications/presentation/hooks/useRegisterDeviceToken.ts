import { useEffect, useMemo, useState } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { RegisterDeviceTokenUseCase } from "../../domain/usecases/RegisterDeveiceTokenUsecase";
import {
  initOnMessage,
  requestAndGetToken,
} from "@/components/firebase/notifications";
import { useAuthStore } from "@/features/core/store/auth";
import { useDeviceStore } from "@/features/core/store/device";
import { useUnregisterDeviceToken } from "./useUnregisterDeviceToken";

export const useRegisterDeviceToken = (enabled = true) => {
  const [fcmNotifications, setFcmNotifications] = useState<any[]>([]);

  const user = useAuthStore((state) => state.user);
  const { deviceId, fcmToken, setDeviceId, setFcmToken } = useDeviceStore();
  const { unregisterToken } = useUnregisterDeviceToken();

  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(() => new RegisterDeviceTokenUseCase(repo), [repo]);

  useEffect(() => {
    let isMounted = true;

    const setup = async () => {
      if (!enabled) return;

      try {
        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
          console.warn("Notifications are not supported in this browser");
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission denied");
          return;
        }

        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        await initOnMessage(setFcmNotifications);

        const newToken = await requestAndGetToken();
        if (!newToken) return;

        let currentDeviceId = deviceId;
        if (!currentDeviceId) {
          currentDeviceId = crypto.randomUUID();
          setDeviceId(currentDeviceId);
        }

        const roleId = user?.role?._id;
        if (!roleId) return;

        if (!fcmToken) {
          await useCase.execute({
            token: newToken,
            platform: "WEB",
            roleId,
            deviceId: currentDeviceId,
            appId: "sv-marketplace-web",
          });

          if (isMounted) setFcmToken(newToken);
          console.log("FCM token registered");
          return;
        }

        if (fcmToken !== newToken) {
          await unregisterToken();

          await useCase.execute({
            token: newToken,
            platform: "WEB",
            roleId,
            deviceId: currentDeviceId,
            appId: "sv-marketplace-web",
          });

          if (isMounted) setFcmToken(newToken);
          console.log("FCM token updated");
        }
      } catch (err) {
        console.error("Notification setup failed:", err);
      }
    };

    setup();

    return () => {
      isMounted = false;
    };
  }, [
    deviceId,
    enabled,
    fcmToken,
    setDeviceId,
    setFcmToken,
    unregisterToken,
    useCase,
    user?.role?._id,
  ]);

  return {
    fcmNotifications,
  };
};
