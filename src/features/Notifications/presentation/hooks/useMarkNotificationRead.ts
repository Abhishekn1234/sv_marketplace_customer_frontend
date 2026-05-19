import { useCallback, useMemo } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecases/MarkNotificationReadUseCase";
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/core/store/auth";


export const useMarkNotificationRead = () => {
  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(() => new MarkNotificationReadUseCase(repo), [repo]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await useCase.execute(notificationId);

      // ✅ ZUSTAND UPDATE
      useAuthStore.getState().markNotificationRead(notificationId);

      toast.success("Notification marked as read");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      throw err;
    }
  }, [useCase]);

  return { markAsRead };
};