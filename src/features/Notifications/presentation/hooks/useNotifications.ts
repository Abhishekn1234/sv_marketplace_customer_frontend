import { useQuery } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetNotificationsUseCase } from "../../domain/usecases/GetNotificationsUsecase";
import type { GetNotificationsParams } from "../../domain/entities/notificationgetparams";


const repo = new NotificationRepositoryImpl();
const useCase = new GetNotificationsUseCase(repo);

export const useNotifications = (
  filters?: GetNotificationsParams
) => {
  return useQuery({
    queryKey: ["notifications", filters],

    queryFn: async () => {
      const safeFilters: GetNotificationsParams = {
        page: filters?.page ?? 1,
        limit: filters?.limit ?? 1000,
        type: filters?.type,
        unreadOnly: filters?.unreadOnly,
      };

      const res = await useCase.execute(safeFilters);

      return Array.isArray(res?.data) ? res.data : [];
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,

    retry: 1,
  });
};