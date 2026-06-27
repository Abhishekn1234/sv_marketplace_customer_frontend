import { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteDisputes } from "../hooks/useInfinteDisputes";
import DisputesSearchBar from "./DisputesSearchBar";
import DisputesList from "./DisputesLists";



export default function ListDisputes() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const sentinelRef = useRef<HTMLDivElement>(null);

  // debounce
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

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [handleIntersect]);

  return (
    <div className="flex flex-col h-[70vh] sm:h-[620px] rounded-2xl bg-gray-50 overflow-hidden">

      <DisputesSearchBar search={search} setSearch={setSearch} />

      <DisputesList
        items={items}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        sentinelRef={sentinelRef}
      />

    </div>
  );
}