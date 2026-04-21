"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { getSocket } from "@/features/core/Websocket/socket";

interface Props {
  booking: Booking | null;
  loading: boolean;
}

export default function JobTrackingWorkerDetails({
  booking,
  loading,
}: Props) {
  const { t } = useLanguage();

  const [localBooking, setLocalBooking] = useState<Booking | null>(null);

  // -----------------------------
  // Normalize worker
  // -----------------------------
  const normalizeWorker = (w: any) => {
    if (!w) return null;

    const workerObj =
      w.worker ||
      (typeof w.workerId === "object" ? w.workerId : null) ||
      w;

    return {
      _id: workerObj?._id || "",
      fullName: workerObj?.fullName || "Unknown Worker",
      phone: workerObj?.phone || "",
      profilePictureUrl: workerObj?.profilePictureUrl || "",
      isVerified: workerObj?.isVerified ?? false,
    };
  };

  const normalizeBookingWorkers = (b: any) => ({
    ...b,
    assignedWorkers:
      b.assignedWorkers?.map(normalizeWorker).filter(Boolean) || [],
  });

  // -----------------------------
  // Sync props → local state
  // -----------------------------
  useEffect(() => {
    if (booking) {
      setLocalBooking(normalizeBookingWorkers(booking));
    }
  }, [booking]);

  // -----------------------------
  // Socket updates
  // -----------------------------
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !booking?._id) return;

    const handler = (data: any) => {
      const updated = data.booking ?? data;

      if (String(updated._id) !== String(booking._id)) return;

      setLocalBooking(normalizeBookingWorkers(updated));
    };

    const events = [
      "booking:update",
      "booking.worker.assigned",
      "booking.worker.accepted",
      "booking.work.started",
      "booking.work.completed-by-worker",
    ];

    events.forEach((e) => socket.on(e, handler));

    return () => {
      events.forEach((e) => socket.off(e, handler));
    };
  }, [booking?._id]);

  const worker = localBooking?.assignedWorkers?.[0] ?? null;

  if (loading) return <div>Loading worker...</div>;

  if (!worker) {
    return (
      <div className="bg-white rounded-2xl p-4 border">
        <h2 className="font-bold text-gray-900">
          {t.jobtrackingpage.sections.yourProfessional}
        </h2>
        <p className="text-gray-500 mt-2">
          {t.jobtrackingpage.sections.workerNotAssigned}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm">
      <h2 className="font-bold mb-5">
        {t.jobtrackingpage.sections.yourProfessional}
      </h2>

      <div className="flex items-center gap-4">
        <img
          src={
            worker.profilePictureUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.fullName)}`
          }
          className="w-14 h-14 rounded-xl object-cover"
        />

        <div>
          <div className="font-semibold flex items-center gap-2">
            {worker.fullName}
            {worker.isVerified && (
              <span className="text-blue-600 text-xs">✔</span>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {localBooking?.service?.name} • {localBooking?.serviceTier?.displayName}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <a
          href={`tel:${worker.phone}`}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center"
        >
          {t.jobtrackingpage.call}
        </a>

        <button className="flex-1 border py-2 rounded-lg">
          {t.jobtrackingpage.message}
        </button>
      </div>
    </div>
  );
}