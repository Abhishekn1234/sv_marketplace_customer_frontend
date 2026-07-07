import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { InboxIcon } from "@/components/icons";
import CommonCard from "@/components/common/CommonCards";
import { statusClass } from "../utils/disputesstatusclass";
import { useLanguage } from "@/features/context/LanguageContext";
import { formatSmartDate } from "@/components/utils/formatsmartdate";


interface Props {
  items: any[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export default function DisputesList({
  items,
  isLoading,
  isFetchingNextPage,
  sentinelRef,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">

      {/* SKELETON */}
      {isLoading &&
        Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-gray-100 border border-gray-200 p-5 animate-pulse"
          >
            <div className="flex justify-between mb-4">
              <div className="h-4 bg-gray-200 w-44 rounded" />
              <div className="h-6 bg-gray-200 w-20 rounded-full" />
            </div>

            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 w-5/6 rounded" />
            </div>
          </div>
        ))}

      {/* CARDS */}
      {!isLoading &&
        items.map((item) => (
          <CommonCard
            key={item._id}
            type="soft"
            className="
              group
              !rounded-2xl
              border-gray-200
              hover:border-blue-200
              hover:shadow-xl
              transition-all
              duration-300
              hover:-translate-y-1
            "
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[15px] sm:text-base font-semibold text-gray-900 group-hover:text-blue-600">
                {item.reason}
              </h3>

              <span
                className={`
                  whitespace-nowrap
                  rounded-full
                  px-3 py-1
                  text-xs font-semibold
                  border shadow-sm
                  ${statusClass(item.status)}
                `}
              >
                {item.status}
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-gray-600 line-clamp-3">
              {item.description}
            </p>

            <div className="mt-5 text-xs text-gray-500">
              {formatSmartDate(item.createdAt)}
            </div>
          </CommonCard>
        ))}

      {/* EMPTY */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-20">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-200">
            <InboxIcon className="h-10 w-10 text-gray-500" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-700">
            {t.common["No data available"]}
          </h3>
        </div>
      )}

      {/* LOADING MORE */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <CommonSpinner />
        </div>
      )}

      <div ref={sentinelRef} className="h-2" />
    </div>
  );
}