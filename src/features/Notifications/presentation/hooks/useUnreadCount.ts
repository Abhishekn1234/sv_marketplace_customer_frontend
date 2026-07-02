import { useQuery } from "@tanstack/react-query";
import { NotificationRepositoryImpl } from "../../data/repositories/NotificationRepoImpl";
import { GetUnreadCountUseCase } from "../../domain/usecases/GetUnreadCountUseCase";

const repo = new NotificationRepositoryImpl();
const useCase = new GetUnreadCountUseCase(repo);

export const useUnreadCount = () => {
  const query = useQuery({
    queryKey: ["unread-count"],
    queryFn: () => useCase.execute(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return {
    count: query.data ?? 0,
    loading: query.isLoading,
    refetch: query.refetch,
  };
};