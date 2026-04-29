import { useCallback } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkAllNotificationsReadUseCase } from "../../domain/usecases/MarkAllNotificationsReadUseCase";
import { useMemo } from "react";

export const useMarkAllAsRead = () => {
  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(() => new MarkAllNotificationsReadUseCase(repo), [repo]);

  const markAllAsRead = useCallback(async () => {
    try {
      await useCase.execute();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [useCase]);

  return { markAllAsRead };
};

