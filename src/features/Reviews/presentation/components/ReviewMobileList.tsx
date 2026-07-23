import { useEffect, useRef } from "react";
import CommonCard from "@/components/common/CommonCards";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import RatingStars from "./RatingStars";
import { Review } from "../../domain/entities/review.types";


interface Props {
  reviews: Review[];
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
}

export default function ReviewMobileList({
  reviews,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col gap-3 md:hidden">
      {reviews.map((review) => (
        <CommonCard key={review._id} type="white" contentClassName="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900">
                {review.service?.name ?? "Service"}
              </p>
              <p className="text-xs text-gray-500">
                {review.workers.map((w) => w.fullName).join(", ") || "Unassigned"}
              </p>
            </div>
            <span className="shrink-0 text-xs text-gray-400">
              {new Date(review.reviewedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-4">
            <RatingStars value={review.serviceRating} label="Service" />
            <RatingStars value={review.workerRating} label="Worker" />
          </div>

          {review.feedback && (
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {review.feedback}
            </p>
          )}
        </CommonCard>
      ))}

      <div ref={sentinelRef} className="h-2 w-full" />
      {isFetchingNextPage && <CommonSpinner center color="blue" size={28} />}
    </div>
  );
}