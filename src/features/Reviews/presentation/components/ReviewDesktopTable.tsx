import { useEffect, useRef } from "react";
import CommonTable, { Column } from "@/components/common/CommonTable";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import RatingStars from "./RatingStars";
import { Review } from "../../domain/entities/review.types";
import { useLanguage } from "@/features/context/LanguageContext";

import { formatDate } from "@/components/utils/formatdate";

interface Props {
  reviews: Review[];
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
}

export default function ReviewDesktopTable({
  reviews,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { t,localize } = useLanguage();
   console.log(reviews);
  const columns: Column<Review>[] = [
    {
      header: t.reviewpage.table.service,
      render: (row) => localize(row.service?.name) ?? t.reviewpage.noFeedback,
    },
    {
      header: t.reviewpage.table.workers,
      render: (row) =>
        row.workers.map((w) => w.fullName).join(", ") || t.reviewpage.unassigned,
    },
    {
      header: t.reviewpage.table.serviceRating,
      render: (row) => <RatingStars value={row.serviceRating} />,
    },
    {
      header: t.reviewpage.table.workerRating,
      render: (row) => <RatingStars value={row.workerRating} />,
    },
    {
      header: t.reviewpage.table.feedback,
      render: (row) => (
        <span className="line-clamp-2 max-w-xs text-gray-700">
          {row.feedback || t.reviewpage.noFeedback}
        </span>
      ),
    },
    {
      header: t.reviewpage.table.date,
      render: (row) => formatDate(row.reviewedAt),
    },
  ];

  useEffect(() => {
    if (!hasNextPage) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && fetchNextPage(),
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="hidden md:block">
      {/* pageSize = reviews.length so CommonTable's own pagination never triggers —
          loading more rows is driven externally by scroll, not page buttons */}
      <CommonTable
        data={reviews}
        columns={columns}
        pageSize={reviews.length || 1}
        emptyText={t.reviewpage.emptyTitle}

      />
      <div ref={sentinelRef} className="h-2 w-full" />
      {isFetchingNextPage && <CommonSpinner center color="blue" size={28} />}
    </div>
  );
}