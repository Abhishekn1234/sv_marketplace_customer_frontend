import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecases/MarkNotificationReadUseCase";
import { toast } from "react-toastify";


const repo = new NotificationRepositoryImpl();
const useCase = new MarkNotificationReadUseCase(repo);

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => useCase.execute(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previous = queryClient.getQueriesData({
        queryKey: ["notifications"],
      });

      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (old: any) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((n: any) =>
                n._id === id ? { ...n, isRead: true } : n
              ),
            })),
          };
        }
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      toast.error("Failed");

      if (context?.previous) {
        queryClient.setQueriesData(
          { queryKey: ["notifications"] },
          context.previous
        );
      }
    },

    onSuccess: () => {
      toast.success("Marked as read");
    },
  });
};