import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecases/MarkNotificationReadUseCase";
import { toast } from "react-toastify";

export const useMarkNotificationRead = () => {
  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(
    () => new MarkNotificationReadUseCase(repo),
    [repo]
  );

  const queryClient = useQueryClient();

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await useCase.execute(notificationId);

      // ✅ INSTANT UI UPDATE
      queryClient.setQueryData(
        ["notifications"],
        (old: any[] = []) =>
          old.map((n) =>
            n.id === notificationId || n._id === notificationId
              ? { ...n, isRead: true }
              : n
          )
      );

      toast.success("Notification marked as read");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      throw err;
    }
  }, [useCase, queryClient]);

  return { markAsRead };
};