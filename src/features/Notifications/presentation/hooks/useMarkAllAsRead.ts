import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecases/MarkAllNotificationsReadUseCase";
import { toast } from "react-toastify";

export const useMarkAllAsRead = () => {
  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(
    () => new MarkAllNotificationsReadUseCase(repo),
    [repo]
  );

  const queryClient = useQueryClient();

  const markAllAsRead = useCallback(async () => {
    try {
      await useCase.execute();

      // ✅ INSTANT UPDATE ALL
      queryClient.setQueryData(
        ["notifications"],
        (old: any[] = []) =>
          old.map((n) => ({ ...n, isRead: true }))
      );

      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    }
  }, [useCase, queryClient]);

  return { markAllAsRead };
};