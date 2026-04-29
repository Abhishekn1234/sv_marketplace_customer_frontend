import { useCallback } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { MarkNotificationReadUseCase } from "../../domain/usecases/MarkNotificationReadUseCase";
import { useMemo } from "react";

export const useMarkNotificationRead = () => {
  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(() => new MarkNotificationReadUseCase(repo), [repo]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await useCase.execute(notificationId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [useCase]);

  return { markAsRead };
};

