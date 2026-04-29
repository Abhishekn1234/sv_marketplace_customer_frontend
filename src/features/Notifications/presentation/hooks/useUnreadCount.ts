import { useEffect, useMemo, useState } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetUnreadCountUseCase } from "../../domain/usecases/GetUnreadCountUseCase";

export const useUnreadCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const repo = useMemo(() => new NotificationRepositoryImpl(), []);
  const useCase = useMemo(() => new GetUnreadCountUseCase(repo), [repo]);

  const fetchUnreadCount = async () => {
    setLoading(true);
    try {
      const res = await useCase.execute();
      setCount(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return { count, loading, refetch: fetchUnreadCount };
};

