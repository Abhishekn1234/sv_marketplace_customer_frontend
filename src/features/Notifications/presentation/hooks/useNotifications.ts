import { useQuery } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetNotificationsUseCase } from "../../domain/usecases/GetNotificationsUsecase";
import type { GetNotificationsParams } from "../../domain/entities/notificationgetparams";

const repo = new NotificationRepositoryImpl();
const useCase = new GetNotificationsUseCase(repo);

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (filters?: GetNotificationsParams) =>
    ["notifications", filters] as const,
};

export const useNotifications = (filters?: GetNotificationsParams) => {
  return useQuery({
    queryKey: notificationKeys.list(filters),

    queryFn: async () => {
      const res = await useCase.execute({
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 100,
        type: filters?.type,
        unreadOnly: filters?.unreadOnly,
      });

      return {
        data: res?.data ?? [],
        pagination: res?.pagination ?? { totalItems: 0 },
      };
    },

    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};