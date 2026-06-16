import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecases/MarkNotificationReadUseCase";

const repo = new NotificationRepositoryImpl();
const useCase = new MarkNotificationReadUseCase(repo);

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => useCase.execute(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["notifications"],
      });

      const previousUnreadCount =
        queryClient.getQueryData<number>(["unread-count"]);

      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((n: any) =>
                n._id === id || n.id === id
                  ? {
                      ...n,
                      isRead: true,
                    }
                  : n
              ),
            })),
          };
        }
      );

      // Update unread badge immediately
      queryClient.setQueryData(
        ["unread-count"],
        (old: number = 0) =>
          Math.max(0, old - 1)
      );

      return {
        previousQueries,
        previousUnreadCount,
      };
    },

    onError: (_err, _id, context) => {
      // Rollback notifications
      context?.previousQueries?.forEach(
        ([queryKey, data]) => {
          queryClient.setQueryData(
            queryKey,
            data
          );
        }
      );

      // Rollback badge
      queryClient.setQueryData(
        ["unread-count"],
        context?.previousUnreadCount
      );
    },

    onSuccess: () => {
      // Refresh all notification queries
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },

    onSettled: () => {
      // Ensure everything stays synced
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });
};