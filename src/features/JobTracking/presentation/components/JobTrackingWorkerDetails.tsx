"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { getSocket } from "@/features/core/Websocket/socket";
import { Image } from "@/components/input";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";

import { useGetChatMessages } from "@/features/WorkerChat/presentation/hooks/useGetChatMessages";
import { BookingEvents } from "@/components/common/BookingEvents";

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

  const [localBooking, setLocalBooking] =
    useState<Booking | null>(null);

  // =========================
  // CHAT MESSAGES
  // =========================
  const { data: messagesData } =
  useGetChatMessages(
    booking?._id || "",
    100
  );
    // console.log(messagesData);

  // =========================
  // UNREAD MESSAGE COUNT
  // =========================
  const unreadMessages = useMemo(() => {
    const data: any = messagesData;

    let messages: any[] = [];

    // API returns array
    if (Array.isArray(data)) {
      messages = data;
    }

    // API returns { data: [] }
    else if (Array.isArray(data?.data)) {
      messages = data.data;
    }

    // API returns { messages: [] }
    else if (Array.isArray(data?.messages)) {
      messages = data.messages;
    }

    // unread only
    return messages.filter(
      (msg) => !msg?.isRead
    ).length;
  }, [messagesData]);

  // =========================
  // NORMALIZE WORKER
  // =========================
  const normalizeWorker = (w: any) => {
    if (!w) return null;

    const workerObj =
      w.worker ||
      (typeof w.workerId === "object"
        ? w.workerId
        : null) ||
      w;

    return {
      _id: workerObj?._id || "",
      fullName:
        workerObj?.fullName ||
        "Unknown Worker",
      phone: workerObj?.phone || "",
      profilePictureUrl:
        workerObj?.profilePictureUrl || "",
      isVerified:
        workerObj?.isVerified ?? false,
    };
  };

  const normalizeBookingWorkers = (
    b: any
  ) => ({
    ...b,
    assignedWorkers:
      b.assignedWorkers
        ?.map(normalizeWorker)
        .filter(Boolean) || [],
  });

  // =========================
  // INITIAL BOOKING
  // =========================
  useEffect(() => {
    if (booking) {
      setLocalBooking(
        normalizeBookingWorkers(booking)
      );
    }
  }, [booking]);

  // =========================
  // SOCKET LISTENERS
  // =========================
  useEffect(() => {
    const socket = getSocket();

    if (!socket || !booking?._id)
      return;

    const handler = (data: any) => {
      const updated =
        data.booking ?? data;

      if (
        String(updated._id) !==
        String(booking._id)
      )
        return;

      setLocalBooking(
        normalizeBookingWorkers(updated)
      );
    };

          const events = [
        BookingEvents.ASSIGNED,
        BookingEvents.WORKER_ACCEPTED,
        BookingEvents.WORK_STARTED,
        BookingEvents.WORK_COMPLETED_BY_WORKER,
        BookingEvents.CANCELLED_BY_WORKER,
        BookingEvents.COORDINATOR_ASSIGNED_WORKER,
        BookingEvents.COORDINATOR_REASSIGNED_WORKER,
      ];

    events.forEach((e) =>
      socket.on(e, handler)
    );

    return () => {
      events.forEach((e) =>
        socket.off(e, handler)
      );
    };
  }, [booking?._id]);

  // =========================
  // CURRENT WORKER
  // =========================
  const worker =
    localBooking?.assignedWorkers?.[0] ??
    null;

  // =========================
  // LOADING
  // =========================
  if (loading) return <CommonSpinner />;

  // =========================
  // NO WORKER
  // =========================
  if (!worker) {
    return (
      <CommonCard
        title={
          t.jobtrackingpage.sections
            .yourProfessional
        }
      >
        <p className="text-gray-500">
          {
            t.jobtrackingpage.sections
              .workerNotAssigned
          }
        </p>
      </CommonCard>
    );
  }

  return (
    <CommonCard
      title={
        t.jobtrackingpage.sections
          .yourProfessional
      }
    >
      {/* WORKER INFO */}
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
              <span className="text-blue-600 text-xs">
                ✔
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {localBooking?.service?.name} •{" "}
            {
              localBooking?.serviceTier
                ?.displayName
            }
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-4">
        {/* CALL BUTTON */}
        <Link
          to={`tel:${worker.phone}`}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center"
        >
          {t.jobtrackingpage.call}
        </Link>

        {/* MESSAGE BUTTON */}
        <div className="relative flex-1">
          {/* UNREAD BADGE */}
          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 z-10 min-w-[22px] h-[22px] px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow">
              {unreadMessages}
            </span>
          )}

          <Button
            className="w-full border-accent-foreground py-2 rounded-lg "
            onClick={() =>
              navigate(
                `/message/${booking?._id}`
              )
            }
          >
            {t.jobtrackingpage.message}
          </Button>
        </div>
      </div>
    </CommonCard>
  );
}