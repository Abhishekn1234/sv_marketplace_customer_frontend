import { useEffect, useMemo, useState } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetNotificationsUseCase } from "../../domain/usecase/GetNotificationsUsecase";

export const useNotifications = (filters: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(() => new GetNotificationsUseCase(repo), [repo]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await useCase.execute(filters);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [JSON.stringify(filters)]);

  return { data, loading, refetch: fetchNotifications };
};