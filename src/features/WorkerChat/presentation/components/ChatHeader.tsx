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

export type WorkerInfo = {
  name: string;
  avatar: string | null;
  status: string | null;
};

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return p.length === 1
    ? p[0][0].toUpperCase()
    : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function Avatar({ worker }: { worker: WorkerInfo }) {
  return (
    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
      {worker.avatar ? (
        <img
          src={worker.avatar}
          alt={worker.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-green-800 text-sm font-bold">
          {initials(worker.name)}
        </span>
      )}
    </div>
  );
}

export default function ChatHeader({ worker }: { worker: WorkerInfo }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCall = () => console.log("Call clicked");
  const handleVideo = () => console.log("Video call clicked");
  const handleInfo = () => console.log("Open info modal");

  return (
    <div className="flex items-center gap-2 px-3 py-2 ">
      
      {/* Back */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className=""
      >
        <ArrowLeftIcon size={20} />
      </Button>

      {/* Avatar */}
      <Avatar worker={worker} />

      {/* Info */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800 truncate">
          {worker.name}
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

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-1">
        <Button 
          onClick={handleCall}
          variant="ghost"
          className=""
        >
          <PhoneIcon size={20} />
        </Button>

        <Button 
          onClick={handleVideo}
          variant="ghost"
          className=""
        >
          <VideoIcon size={20} />
        </Button>
      </div>

      {/* Menu */}
      <div className="relative" ref={menuRef}>
        <Button
          onClick={() => setOpen((p) => !p)}
          variant="ghost"
          className=""
        >
          <MoreVerticalIcon />
        </Button>

       {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          
          <Button 
            onClick={handleCall}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 sm:hidden whitespace-nowrap"
          >
            <PhoneIcon size={16} className="shrink-0" />
            <span>Call</span>
          </Button>

          <Button 
            onClick={handleVideo}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 sm:hidden whitespace-nowrap"
          >
            <VideoIcon size={16} className="shrink-0" />
            <span>Video Call</span>
          </Button>

          <Button 
            onClick={handleInfo}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
          >
            <InfoIcon size={16} className="shrink-0" />
            <span>View Info</span>
          </Button>

        </div>
      )}
      </div>
    </div>
  );
}