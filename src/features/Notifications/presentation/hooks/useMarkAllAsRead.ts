import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecases/MarkAllNotificationsReadUseCase";
// import { useAuthStore } from "@/features/core/store/auth";

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(
    () => new MarkAllNotificationsReadUseCase(repo),
    [repo]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await useCase.execute();

      // =========================
      // 1. UPDATE REACT QUERY (IMPORTANT)
      // =========================
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((n: any) => ({
                ...n,
                isRead: true,
              })),
            })),
          };
        }
      );

      // =========================
      // 2. OPTIONAL ZUSTAND SYNC
      // =========================
      // const { setNotificationsList } = useAuthStore.getState();

      // setNotificationsList((prev: any[]) =>
      //   prev.map((n) => ({ ...n, isRead: true }))
      // );

      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    }
  }, [useCase, queryClient]);

  return { markAllAsRead };
};