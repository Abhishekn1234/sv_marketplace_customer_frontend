"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Button from "@/components/input/Button";
import {
  ArrowLeftIcon,
  PhoneIcon,
  MoreVerticalIcon,
  InfoIcon,
} from "@/components/icons";
import { Image } from "@/components/input";
import Tooltip from "@/components/common/ToolTip";
import CommonModal from "@/components/common/CommonModal";
import { Avatar } from "../utils/avatar";
import { initials } from "../utils/initials";
import type { Worker } from "@/features/Bookings/domain/entities/worker.types";
import { useLanguage } from "@/features/context/LanguageContext";

export default function ChatHeader({ worker,bookingId }: { worker: Worker,bookingId:string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  const isOnline = Boolean(worker.status && worker.status.toLowerCase() !== "offline");
  const statusLabel = isOnline ? worker.status : "Offline";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCall = () => {
    if (!worker?.phone) return;
    window.location.href = `tel:${worker.phone}`;
  };

  const handleInfo = () => {
    setInfoOpen(true);
    setOpen(false);
  };

  return (
    <div className=" flex items-center gap-3">
      <Tooltip text="Go back" position="bottom">
        <Button
          onClick={() => navigate(`/jobtracking/${bookingId}`)}
          variant="ghost"
          icon
          radius="full"
          className="text-gray-700 hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeftIcon size={20} />
        </Button>
      </Tooltip>

      <Avatar worker={worker} />

      <div className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-gray-900">
          {worker.fullName}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <span
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.12)]" : "bg-gray-300"
            }`}
          />
          {statusLabel}
        </span>
      </div>

      <div className="hidden items-center gap-1 sm:flex">
        <Tooltip text="Call" position="bottom">
          <Button
            onClick={handleCall}
            variant="ghost"
            icon
            radius="full"
            className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            aria-label="Call worker"
          >
            <PhoneIcon size={20} />
          </Button>
        </Tooltip>
      </div>

      <div className="relative" ref={menuRef}>
        <Tooltip text="More" position="bottom">
          <Button
            onClick={() => setOpen((p) => !p)}
            variant="ghost"
            icon
            radius="full"
            className="text-gray-700 hover:bg-gray-100"
            aria-label="More options"
          >
            <MoreVerticalIcon />
          </Button>
        </Tooltip>

        {open && (
          <div className="absolute right-0 z-[9999] mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
            <Button
              onClick={handleCall}
              leftIcon={<PhoneIcon size={16} />}
              className="w-full justify-start rounded-none px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:hidden"
            >
              {t.jobtrackingpage.call}
            </Button>

            <Button
              onClick={handleInfo}
              leftIcon={<InfoIcon size={16} />}
              className="w-full justify-start rounded-none px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {t.Bookingspage.Actions.viewDetails}
            </Button>
          </div>
        )}
      </div>
     {infoOpen &&
    <CommonModal
  open={infoOpen}
  onClose={() => setInfoOpen(false)}
  width="max-w-md"
  className="mx-4"
>
  {/* Close Button */}
  <Button
    icon
    variant="ghost"
    radius="full"
    onClick={() => setInfoOpen(false)}
    className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 text-gray-500 hover:bg-white/80 hover:text-gray-900"
  >
    <X size={18} />
  </Button>

  {/* Header */}
  <div className="flex flex-col items-center bg-gradient-to-b from-blue-50 to-white px-4 sm:px-5 pb-5 pt-6 sm:pt-7">
    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-100 shadow-md">
      {worker.profilePictureUrl ? (
        <Image
          src={worker.profilePictureUrl}
          alt={worker.fullName}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-lg sm:text-xl font-bold text-blue-800">
          {initials(worker?.fullName)}
        </span>
      )}
    </div>

    <h2 className="mt-3 text-center text-base sm:text-lg font-bold text-gray-900 break-words">
      {worker.fullName}
    </h2>

    <div className="mt-2 flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      <span className="text-xs sm:text-sm text-gray-600">
        {statusLabel}
      </span>
    </div>
  </div>

  {/* Details */}
  <div className="space-y-4 px-4 sm:px-5 py-4 text-sm">
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-gray-500">
        {t.profilepage.phone}
      </span>

      <span className="font-medium break-all sm:text-right">
        {worker.phone || "N/A"}
      </span>
    </div>

    <div className="border-t border-gray-100" />

    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-gray-500">
        {t.profilepage.email}
      </span>

      <span className="font-medium break-all sm:text-right max-w-full">
        {worker.email || "N/A"}
      </span>
    </div>
  </div>

  {/* Footer */}
  <div className="px-4 sm:px-5 pb-5">
    <Button
      onClick={() => setInfoOpen(false)}
      className="w-full rounded-xl bg-blue-600 py-2.5 text-white transition-colors hover:bg-blue-700"
    >
      {t.common.close}
    </Button>
  </div>
</CommonModal>
     }
     
    </div>
  );
}
