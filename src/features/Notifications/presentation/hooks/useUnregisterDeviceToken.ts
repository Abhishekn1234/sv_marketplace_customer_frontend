import { useMemo } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { UnregisterDeviceTokenUseCase } from "../../domain/usecases/UnregisterDeviceTokenUsecase";
import { useDeviceStore } from "@/features/core/store/device";

export const useUnregisterDeviceToken = () => {
  const { fcmToken, deviceId, clearDevice } = useDeviceStore();

  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(() => new UnregisterDeviceTokenUseCase(repo), [repo]);

  const unregisterToken = async () => {
    if (!fcmToken || !deviceId) {
      console.warn("⚠️ Missing token or deviceId");
      return false;
    }

    try {
      await useCase.execute({
        token: fcmToken,
        // deviceId, // ✅ IMPORTANT
      });

      // console.log("✅ Token unregistered");

      /* ✅ Clean state properly */
      clearDevice();

      return true;
    } catch (err) {
      console.error("❌ Token unregister failed", err);
      return false;
    }
  };

  return {
    unregisterToken,
    fcmToken,
    deviceId,
  };
};