import { useCallback, useMemo } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecases/MarkAllNotificationsReadUseCase";
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/core/store/auth";

export const useMarkAllAsRead = () => {
  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(
    () => new MarkAllNotificationsReadUseCase(repo),
    [repo]
  );

  const resetUnread = useAuthStore((s) => s.resetUnread);

  const markAllAsRead = useCallback(async () => {
    try {
      await useCase.execute();

      // ✅ INSTANT RESET
      resetUnread();

      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    }
  }, [useCase, resetUnread]);

  return { markAllAsRead };
};