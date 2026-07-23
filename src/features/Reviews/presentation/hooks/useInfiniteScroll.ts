import { useEffect, useRef } from "react";

interface Props {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => Promise<unknown>;
}

export function useInfiniteScrollSentinel({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          await fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return sentinelRef;
}