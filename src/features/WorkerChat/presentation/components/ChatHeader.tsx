"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/input/Button";
import {
  ArrowLeftIcon,
  PhoneIcon,
  VideoIcon,
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

export default function ChatHeader({ worker }: { worker: Worker }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const {t}=useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  // close dropdown on outside click
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

  const handleVideo = () => {
    if (!worker?._id) return;
    navigate(`/video-call/${worker._id}`);
  };

  const handleInfo = () => {
    setInfoOpen(true);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white shadow-sm relative z-50">

      {/* Back */}
      <Tooltip text="Go back" position="bottom">
        <Button onClick={() => navigate(-1)} variant="ghost">
          <ArrowLeftIcon size={20} />
        </Button>
      </Tooltip>

      {/* Avatar */}
      <Avatar worker={worker} />

      {/* Name + Status */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800 truncate">
          {worker.fullName}
        </span>

        {worker.status && (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-green-600 font-medium">
              {worker.status}
            </span>
          </>
        )}
      </div>

      {/* Desktop actions */}
      <div className="hidden sm:flex items-center gap-1">
        <Tooltip text="Call" position="bottom">
          <Button onClick={handleCall} variant="ghost">
            <PhoneIcon size={20} />
          </Button>
        </Tooltip>

        <Tooltip text="Video Call" position="bottom">
          <Button onClick={handleVideo} variant="ghost">
            <VideoIcon size={20} />
          </Button>
        </Tooltip>
      </div>

      {/* Menu */}
      <div className="relative" ref={menuRef}>
        <Tooltip text="More" position="bottom">
         <Button
          onClick={() => setOpen((p) => !p)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <MoreVerticalIcon />
        </Button>
        </Tooltip>
        

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] overflow-hidden">

            <Button
              onClick={handleCall}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 sm:hidden"
            >
              <PhoneIcon size={16} />
             {t.jobtrackingpage.call}
            </Button>

            <Button
              onClick={handleVideo}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 sm:hidden"
            >
              <VideoIcon size={16} />
             {t.common["Video Call"]}
            </Button>

            <Button
              onClick={handleInfo}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
            >
              <InfoIcon size={16} />
             {t.Bookingspage.Actions.viewDetails}
            </Button>
          </div>
        )}
      </div>

      {/* ✅ SINGLE MODAL ONLY */}
    <CommonModal open={infoOpen} onClose={() => setInfoOpen(false)}>
  
  {/* ✅ ADD THIS WRAPPER */}
  <div className="relative w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden">

    {/* Close Button */}
            <Button
            icon
            variant="secondary"
            onClick={() => setInfoOpen(false)}
            className="absolute top-3 right-3"
            >
            ✕
            </Button>

    {/* Header */}
    <div className="flex flex-col items-center pt-6 pb-4 bg-gradient-to-b from-green-50 to-white">

      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-green-100 flex items-center justify-center">
        {worker.profilePictureUrl ? (
          <Image
            src={worker.profilePictureUrl}
            alt={worker.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-green-800 text-xl font-bold">
            {initials(worker?.fullName)}
          </span>
        )}
      </div>

      <h2 className="mt-3 text-lg font-bold text-gray-800">
        {worker.fullName}
      </h2>

      <div className="flex items-center gap-2 mt-1">
        <span className={`w-2 h-2 rounded-full ${
          worker.status ? "bg-green-500" : "bg-gray-400"
        }`} />
        <span className="text-sm text-gray-600">
          {worker.status || "Offline"}
        </span>
      </div>
    </div>

    {/* Details */}
    <div className="px-5 py-4 space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">{t.profilepage.phone}</span>
        <span className="font-medium text-gray-800">
          {worker.phone || "N/A"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">{t.profilepage.email}</span>
        <span className="font-medium text-gray-800 break-all text-right">
          {worker.email || "N/A"}
        </span>
      </div>
    </div>

    {/* Footer */}
    <div className="px-5 pb-5">
      <Button
        onClick={() => setInfoOpen(false)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2"
      >
        {t.common.close}
      </Button>
    </div>

  </div>
</CommonModal>

    </div>
  );
}