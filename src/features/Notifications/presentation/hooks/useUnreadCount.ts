import { useEffect, useState } from "react";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetUnreadCountUseCase } from "../../domain/usecases/GetUnreadCountUseCase";
import { useAuthStore } from "@/features/core/store/auth";

export const useUnreadCount = () => {
  const count = useAuthStore(
    (state) => state.notifications.unreadCount
  );

  const setCount = useAuthStore(
    (state) => state.setUnreadCount
  );

  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    setLoading(true);
    try {
      const repo = new NotificationRepositoryImpl();
      const useCase = new GetUnreadCountUseCase(repo);

      const res = await useCase.execute();
      // console.log("Unread count:", res);

      setCount(res); // ✅ now updates Zustand store
    } catch (err) {
      console.error("Unread count fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return {
    count,
    loading,
    refetch: fetchUnreadCount,
  };
};