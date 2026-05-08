"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { getSocket } from "@/features/core/Websocket/socket";
import { Image } from "@/components/input";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";

interface Props {
  booking: Booking | null;
  loading: boolean;
}

export default function JobTrackingWorkerDetails({
  booking,
  loading,
}: Props) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [localBooking, setLocalBooking] = useState<Booking | null>(null);

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

  useEffect(() => {
    if (booking) {
      setLocalBooking(normalizeBookingWorkers(booking));
    }
  }, [booking]);

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
      "booking.cancelled.worker",
    ];

    events.forEach((e) => socket.on(e, handler));

    return () => {
      events.forEach((e) => socket.off(e, handler));
    };
  }, [booking?._id]);

  const worker = localBooking?.assignedWorkers?.[0] ?? null;

  if (loading) return <CommonSpinner />;

  if (!worker) {
    return (
      <CommonCard
        title={t.jobtrackingpage.sections.yourProfessional}
      >
        <p className="text-gray-500">
          {t.jobtrackingpage.sections.workerNotAssigned}
        </p>
      </CommonCard>
    );
  }

  return (
    <CommonCard
      title={t.jobtrackingpage.sections.yourProfessional}
    >
      <div className="flex items-center gap-4">
        <Image
          src={
            worker.profilePictureUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              worker.fullName
            )}`
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
            {localBooking?.service?.name} •{" "}
            {localBooking?.serviceTier?.displayName}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Link
          to={`tel:${worker.phone}`}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center"
        >
          {t.jobtrackingpage.call}
        </Link>

        <Button
          className="flex-1 border py-2 rounded-lg"
          onClick={() => navigate(`/message/${worker._id}/${booking?._id}`)}
        >
          {t.jobtrackingpage.message}
        </Button>
      </div>
    </CommonCard>
  );
}