"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/features/context/LanguageContext";
import { useNotifications } from "@/features/Notifications/presentation/hooks/useNotifications";
import { useMarkNotificationRead } from "@/features/Notifications/presentation/hooks/useMarkNotificationRead";
import { getNotificationTarget } from "@/features/Notifications/presentation/utils/notificationNavigation";
import { BellIcon } from "../icons/BellIcon";

import clsx from "clsx";
import { iconBase } from "./iconbase";
import CommonSpinner from "./CommonLoadingSpinner";

type Props = {
  direction?: "up" | "down";
};

export default function CommonNotificationFloater({
  direction = "down",
}: Props) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { t, isRTLOrder:isRTL } = useLanguage();

  const { mutateAsync: markAsRead } = useMarkNotificationRead();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications({
    unreadOnly: false,
  });

  // Fetch all pages automatically
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notifications = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleNotificationClick = async (item: any) => {
    const target = getNotificationTarget(item);

    if (!target) return;

    const id = item._id || item.id;

    try {
      await markAsRead(id);

      navigate(target);
      setOpen(false);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
    <Button
  onClick={() => setOpen((prev) => !prev)}
  variant="ghost"
  size="lg"
  className={clsx(
    "relative flex items-center justify-center",
    direction === "down" && "hidden sm:flex"
  )}
>
  <BellIcon className={clsx(iconBase)} />

  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[10px] text-black rounded-full flex items-center justify-center border-2 border-white bg-blue-300">
      {unreadCount}
    </span>
  )}
</Button>

      {open && (
        <div
          className={clsx(
            "absolute z-50 bg-white rounded-2xl shadow-xl border",
            "w-[calc(100vw-2rem)] max-w-80",

            direction === "up"
              ? "bottom-full mb-3"
              : "top-full mt-3",

            // Mobile => always centered
            "left-1/2 -translate-x-1/2",

            // Desktop
            "sm:translate-x-1/2 sm:left-auto",

            // Desktop RTL => right aligned
            // Desktop LTR => keep current design (right aligned)
            "sm:right-0"
          )}
        >
          <div className="px-4 py-3 border-b flex justify-between">
            <h3 className="font-semibold text-sm">
              {t.notificationpage.title} ({unreadCount})
            </h3>

            <Button
              onClick={() => {
                navigate("/notifications");
                setOpen(false);
              }}
              variant="ghost"
              className="text-xs"
            >
              {t.navbar["Show All"]}
            </Button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                {t.notificationpage.noNotifications}
              </p>
            ) : (
              notifications.map((item: any) => (
                <div
                  key={item._id || item.id}
                  className={clsx(
                    "px-4 py-3 border-b last:border-b-0",
                    !item.isRead
                      ? "bg-blue-50/40"
                      : "bg-white"
                  )}
                >
                  <div
                    onClick={() =>
                      handleNotificationClick(item)
                    }
                    className="cursor-pointer"
                  >
                    <p className="text-sm font-semibold">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {item.message}
                    </p>
                  </div>

                  <div
                    className={clsx(
                      "mt-2 flex",
                      isRTL
                        ? "justify-start"
                        : "justify-end"
                    )}
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(item);
                      }}
                      variant="ghost"
                      className="text-xs"
                    >
                      {t.common.open}
                    </Button>
                  </div>
                </div>
              ))
            )}

            {isFetchingNextPage && (
              <div className="p-3 text-center text-xs text-gray-500">
                <CommonSpinner color="blue" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}