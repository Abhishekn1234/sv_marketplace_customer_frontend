"use client";

import { useState, useEffect } from "react";
import { useReviews } from "./hooks/useReviews";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { SearchIcon, ArrowLeftIcon } from "@/components/icons";
import { Input } from "@/components/input";
import Button from "@/components/input/Button";
import Select from "@/components/input/Select";
import ReviewMobileList from "./components/ReviewMobileList";
import ReviewDesktopTable from "./components/ReviewDesktopTable";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/context/LanguageContext";

export default function ReviewsPage() {
  const { t } = useLanguage();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const SORT_OPTIONS = [
    { label: t.reviewpage.sort.newest, value: "createdAt:desc" },
    { label: t.reviewpage.sort.oldest, value: "createdAt:asc" },
    { label: t.reviewpage.sort.highestRated, value: "serviceRating:desc" },
    { label: t.reviewpage.sort.lowestRated, value: "serviceRating:asc" },
  ];

  const [sort, setSort] = useState(SORT_OPTIONS[0].value);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const {
    reviews,
    total,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useReviews({ search, sort });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          iconOnly
          radius="full"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeftIcon className="h-5 w-5 text-gray-700" />}
          className="border border-gray-200 hover:border-gray-300"
        />
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {t.reviewpage.title}
          </h1>
          {!isLoading && (
            <p className="text-sm text-gray-500">
              {total === 1
                ? t.reviewpage.reviewCount_one.replace("{{count}}", String(total))
                : t.reviewpage.reviewCount_other.replace("{{count}}", String(total))}
            </p>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-row items-center gap-3 rounded-2xl border border-gray-50 bg-gray-50/60 p-3">
        <Input
          value={searchInput}
          onChange={setSearchInput}
          placeholder={t.reviewpage.searchPlaceholder}
          leftElement={<SearchIcon className="h-4 w-4 text-gray-400" />}
          containerClassName="flex-1 min-w-0"
          radius="full"
          className="bg-white"
        />
        <Select
          value={sort}
          onChange={setSort}
          options={SORT_OPTIONS}
          radius="full"
          className="w-36 shrink-0 sm:w-52"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20">
          <CommonSpinner center color="blue" size={40} />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-1 py-20 text-center">
          <p className="text-sm font-medium text-red-500">{t.reviewpage.errorTitle}</p>
          <p className="text-xs text-gray-400">{t.reviewpage.errorSubtitle}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-20 text-center">
          <p className="text-sm font-medium text-gray-700">{t.reviewpage.emptyTitle}</p>
          <p className="text-xs text-gray-400">{t.reviewpage.emptySubtitle}</p>
        </div>
      ) : (
        <>
          <ReviewMobileList
            reviews={reviews}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
          <ReviewDesktopTable
            reviews={reviews}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            
          />
        </>
      )}
    </div>
  );
}