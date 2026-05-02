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

  const resetUnread = useAuthStore(
    (state) => state.resetUnread
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await useCase.execute();

      // ✅ update global state
      resetUnread();

      toast.success("All notifications marked as read");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to mark all as read";

      toast.error(message);

      throw err;
    }
  }, [useCase, resetUnread]);

  return { markAllAsRead };
};
