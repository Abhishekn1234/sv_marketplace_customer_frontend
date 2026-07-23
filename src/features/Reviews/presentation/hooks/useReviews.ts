import { useInfiniteQuery } from "@tanstack/react-query";

import {
  ReviewListResponse,
  ReviewQuery,
} from "../../domain/entities/review.types";

import { ReviewRepositoryImpl } from "../../data/repositories/review.repository.impl";
import { GetMyReviewsUseCase } from "../../domain/usecase/get-my-reviews.usecase";

const repository = new ReviewRepositoryImpl();
const useCase = new GetMyReviewsUseCase(repository);

const LIMIT = 10;

export const REVIEW_QUERY_KEY = "reviews";

export function useReviews({
  search = "",
  sort = "createdAt:desc",
}: Omit<ReviewQuery, "page" | "limit"> = {}) {
  const query = useInfiniteQuery({
    queryKey: [REVIEW_QUERY_KEY, search, sort],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      useCase.execute({
        page: pageParam as number,
        limit: LIMIT,
        search,
        sort,
      }),

    getNextPageParam: (lastPage: ReviewListResponse) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  });

  const pages = query.data?.pages ?? [];
const lastPage = pages.length > 0 ? pages[pages.length - 1] : undefined;

return {
  reviews: pages.flatMap((page) => page.data),
  pagination: lastPage?.pagination,
  total: pages[0]?.pagination.totalItems ?? 0,

  isLoading: query.isLoading,
  isError: query.isError,
  error: query.error,

  hasNextPage: query.hasNextPage,
  fetchNextPage: query.fetchNextPage,
  isFetchingNextPage: query.isFetchingNextPage,

  refetch: query.refetch,
};
}