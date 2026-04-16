"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useLanguage } from "@/features/context/LanguageContext";
import { getSocket, initializeSocket } from "@/features/core/Websocket/socket";
import { useAuthStore } from "@/features/core/store/auth";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

export default function JobTrackingWorkerDetails({bookings,loading}:{bookings:Booking[],loading:boolean}) {
  const { bookingId } = useParams<{ bookingId: string }>();
  
  const { t } = useLanguage();
  const { accessToken } = useAuthStore();

  const [localBooking, setLocalBooking] = useState<any>(null);

  // ✅ Load from cache (NO API CALL)
  useEffect(() => {
  if (!bookings || !bookingId) return;

  const found = bookings.find((b) => b._id === bookingId);

  if (found) {
    const normalizedWorkers =
      found.assignedWorkers?.map((w: any) => ({
        ...w,
        worker: w.workerId || w.worker,
      })) ?? [];

    setLocalBooking({
      ...found,
      assignedWorkers: normalizedWorkers,
    });
  }
}, [bookings, bookingId]);
  // ✅ Init socket
  useEffect(() => {
    if (!accessToken) return;
    initializeSocket(accessToken);
  }, [accessToken]);

  // ✅ Listen for worker updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    const handler = (_event: string, payload: any) => {
      if (payload.bookingId !== bookingId) return;

      console.log("📡 Worker Update:", payload);

      setLocalBooking((prev: any) => {
        if (!prev) return prev;

        // ✅ worker assigned / updated
        if (payload.worker || payload.assignedWorker) {
          return {
            ...prev,
            assignedWorkers: [
              {
                worker: payload.worker || payload.assignedWorker,
                assignedAt:
                  payload.assignedAt || new Date().toISOString(),
              },
            ],
          };
        }

        return prev;
      });
    };

    socket.onAny(handler);

    return () => {
      socket.offAny(handler);
    };
  }, [bookingId]);

  const worker =
  localBooking?.assignedWorkers?.[0]?.workerId ||
  localBooking?.assignedWorkers?.[0]?.worker;

  if (loading) return <div>Loading worker...</div>;

  if (!worker) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">
          {t.jobtrackingpage.sections.yourProfessional}
        </h2>
        <p className="text-sm text-gray-500 mt-3">
          {t.jobtrackingpage.sections.workerNotAssigned}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm w-full min-w-0">
      
      <h2 className="text-base font-bold text-gray-900 mb-5">
        {t.jobtrackingpage.sections.yourProfessional}
      </h2>

      {/* Profile */}
      <div className="flex items-center gap-4 mb-5 min-w-0">
        <img
          src={
            worker.profilePictureUrl ??
            "https://ui-avatars.com/api/?name=" + worker.fullName
          }
          alt={worker.fullName}
          className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 font-bold text-gray-900 text-lg mb-1 min-w-0">
            <span className="break-words leading-tight w-full">
              {worker.fullName}
            </span>

            {worker.isVerified && (
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 break-words leading-snug">
            {localBooking?.service?.name ?? "Service"} •{" "}
            {localBooking?.serviceTier?.displayName ?? "Tier"}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href={`tel:${worker.phone}`}
          className="flex-1 h-12 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 flex items-center justify-center"
        >
          {t.jobtrackingpage.call}
        </a>

        <button className="flex-1 h-12 rounded-lg bg-white border border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 flex items-center justify-center">
          {t.jobtrackingpage.message}
        </button>
      </div>
    </div>
  );
}