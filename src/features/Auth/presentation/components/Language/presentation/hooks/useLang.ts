import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LanguageCode } from "@/features/context/types/language";
import { LanguageUseCase } from "../../domain/usecase/LanguageUsecase";
import { LanguageRepoImpl } from "../../data/repositories/LanguageRepoImpl";

const repo = new LanguageRepoImpl();
const useCase = new LanguageUseCase(repo);

export function useLang() {
  const queryClient = useQueryClient();


  const {
    data: language = "en",
    isLoading: isFetching,
    isError: isFetchError,
  } = useQuery<LanguageCode>({
    queryKey: ["language"],
    queryFn: () => useCase.getLanguage(),
    initialData: "en",
    staleTime: Infinity, 
  });


  const mutation = useMutation<LanguageCode, unknown, LanguageCode>({
    mutationFn: (code: LanguageCode) => useCase.setLanguage(code),
    onSuccess: (lang) => {
      queryClient.setQueryData(["language"], lang);
    },
  });

  const setLanguage = async (code: LanguageCode) => {
    return mutation.mutateAsync(code);
  };

  return {
    language,
    setLanguage,
    loading: isFetching || mutation.status === "pending", 
    error: isFetchError || mutation.isError,
  };
}
