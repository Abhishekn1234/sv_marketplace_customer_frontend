import { useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecases/MarkAllNotificationsReadUseCase";

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  const repo = useMemo(
    () => new NotificationRepositoryImpl(),
    []
  );

  const useCase = useMemo(
    () => new MarkAllNotificationsReadUseCase(repo),
    [repo]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await useCase.execute();

      // Update notification list
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old?.pages) return old;

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

      // Update badge instantly
      queryClient.setQueryData(
        ["unread-count"],
        0
      );

      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    }
  }, [useCase, queryClient]);

  return { markAllAsRead };
};