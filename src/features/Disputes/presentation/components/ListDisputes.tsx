import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteDisputes } from "../hooks/useInfinteDisputes";
import DisputesSearchBar from "./DisputesSearchBar";
import DisputesList from "./DisputesLists";

export default function ListDisputes() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteDisputes(debouncedSearch);

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const first = entries[0];

      if (
        first.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    if (!scrollRef.current || !sentinelRef.current) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: scrollRef.current,
      rootMargin: "100px",
      threshold: 0,
    });

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div className="flex flex-col h-full rounded-none sm:rounded-2xl bg-gray-50 overflow-hidden">
      <DisputesSearchBar
        search={search}
        setSearch={setSearch}
      />

      <DisputesList
        items={items}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        sentinelRef={sentinelRef}
        scrollRef={scrollRef}
      />
    </div>
  );
}