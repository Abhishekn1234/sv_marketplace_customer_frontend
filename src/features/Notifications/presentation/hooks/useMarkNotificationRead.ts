import { useCallback, useMemo } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecases/MarkNotificationReadUseCase";
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/core/store/auth";

export const useMarkNotificationRead = () => {
  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(
    () => new MarkNotificationReadUseCase(repo),
    [repo]
  );

  const decrementUnread = useAuthStore(
    (state) => state.decrementUnread
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await useCase.execute(notificationId);

        // ✅ update global state
        decrementUnread();

        toast.success("Notification marked as read");
      } catch (err: any) {
        console.error(err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong";

        toast.error(message);

        throw err;
      }
    },
    [useCase, decrementUnread]
  );

  return { markAsRead };
};

