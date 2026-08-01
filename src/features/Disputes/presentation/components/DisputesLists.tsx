import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { InboxIcon } from "@/components/icons";
import CommonCard from "@/components/common/CommonCards";
import { statusClass } from "../utils/disputesstatusclass";
import { useLanguage } from "@/features/context/LanguageContext";
import { formatSmartDate } from "@/components/utils/formatsmartdate";
import { GetAllDisputes } from "../../domain/entities/getdisputesall";
import { RefObject } from "react";

interface Props {
  items: GetAllDisputes[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
}

function formatReasonType(reasonType?: string) {
  if (!reasonType) return "";

  return reasonType
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function DisputesList({
  items,
  isLoading,
  isFetchingNextPage,
  sentinelRef,
  scrollRef,
}: Props) {
  const { t } = useLanguage();

  return (
    <div
      ref={scrollRef}
      className="
        flex-1
        overflow-y-auto
        px-3
        sm:px-5
        pt-3
        sm:pt-4
        pb-28
        sm:pb-6
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
      "
    >
      <div
        className="
          grid
          grid-cols-1
          xs:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-1
          gap-3
        "
      >
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-gray-200 p-4 animate-pulse"
            >
              <div className="flex justify-between mb-3">
                <div className="h-3.5 bg-gray-200 w-2/3 rounded" />
                <div className="h-5 bg-gray-200 w-14 rounded-full" />
              </div>

              <div className="space-y-2">
                <div className="h-2.5 bg-gray-200 rounded" />
                <div className="h-2.5 bg-gray-200 w-5/6 rounded" />
              </div>
            </div>
          ))}

        {!isLoading &&
          items.map((item) => (
            <CommonCard
              key={item._id}
              type="soft"
              className="
                group
                !rounded-xl
                !bg-white
                border-gray-200
                hover:border-blue-200
                hover:shadow-md
                transition-all
                duration-200
                p-4
                flex
                flex-col
              "
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate">
                    {formatReasonType(item.reasonType)}
                  </h3>

                  {item.bookingCode && (
                    <p className="text-[10px] text-gray-400 truncate">
                      {item.bookingCode}
                    </p>
                  )}
                </div>

                <span
                  className={`
                    px-2
                    py-0.5
                    rounded-full
                    text-[10px]
                    border
                    ${statusClass(item.status)}
                  `}
                >
                  {item.status}
                </span>
              </div>

              <p className="mt-3 text-[13px] text-gray-600 line-clamp-2 flex-1">
                {item.description}
              </p>

              <div className="mt-3 flex justify-between text-[10px] text-gray-400">
                <span>{formatSmartDate(item.createdAt)}</span>

                {item.raisedBy && (
                  <span>{formatReasonType(item.raisedBy)}</span>
                )}
              </div>
            </CommonCard>
          ))}
      </div>

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <InboxIcon className="h-8 w-8 text-gray-400" />
          <p className="mt-4 text-sm font-medium">
            {t.common["No data available"]}
          </p>
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <CommonSpinner />
        </div>
      )}

      <div ref={sentinelRef} className="h-8" />
    </div>
  );
}