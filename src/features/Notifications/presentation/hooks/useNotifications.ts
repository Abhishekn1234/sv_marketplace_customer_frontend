import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/core/store/auth";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";

import type { GetNotificationsParams } from "../../domain/entities/notificationgetparams";
import { GetNotificationsUseCase } from "../../domain/usecases/GetNotificationsUsecase";

const repo = new NotificationRepositoryImpl();
const useCase = new GetNotificationsUseCase(repo);

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (filters?: GetNotificationsParams) =>
    ["notifications", filters] as const,
};

export const useNotifications = (filters?: GetNotificationsParams) => {
  const setNotifications = useAuthStore((s) => s.setNotificationsList);

  return useInfiniteQuery({
    queryKey: notificationKeys.list(filters),

    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const res = await useCase.execute({
        page: pageParam,
        limit: filters?.limit ?? 20,
        type: filters?.type,
        unreadOnly: filters?.unreadOnly,
      });

      const formatted = {
        data: res?.data ?? [],
        pagination: res?.pagination ?? {
          totalItems: 0,
          currentPage: pageParam,
          hasNextPage: false,
        },
      };

      // optional zustand sync
      setNotifications(formatted.data);

      return formatted;
    },

    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },

    refetchOnWindowFocus: false,
  });
};