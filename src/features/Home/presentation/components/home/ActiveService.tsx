"use client";

import { useMemo } from "react";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { progressMap } from "../../helpers/progressmap";
import { getBookingFlags } from "../../helpers/getbookingflags";
import { useLanguage } from "@/features/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import type { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import Button from "@/components/input/Button";
import { Image } from "@/components/input";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";
export default function ActiveService() {
  const { bookings, loading } = useBookings();
  const { t } = useLanguage();
  const  navigate = useNavigate();
  const {services}=useServices();
  console.log(services);
  const ACTIVE_STATUSES = [
    "REQUESTED",
    "ASSIGNED",
    "WORKER_ACCEPTED",
    "ACCEPTED",
    "IN_PROGRESS",
    "WORK_COMPLETED_PENDING",
  ];

  const allowedStatuses = [
    "IN_PROGRESS",
    "ACCEPTED",
    "WORKER_ACCEPTED",
    "REQUESTED",
    "WORK_COMPLETED_PENDING",
    "ASSIGNED",
  ];

  const activeBookings = useMemo(() => {
    return (bookings || []).filter((b) =>
      ACTIVE_STATUSES.includes(b.status)
    );
  }, [bookings]);

  const today = new Date().toDateString();

  const todayBooking = useMemo(() => {
    return activeBookings.find((b) => {
      const dateStr = b?.schedule?.startDateTime || b?.createdAt;
      if (!dateStr) return false;

      const d = new Date(dateStr);
      return !isNaN(d.getTime()) && d.toDateString() === today;
    });
  }, [activeBookings, today]);

  const nextBooking = useMemo(() => {
    const upcoming = activeBookings
      .filter(
        (b) =>
          typeof b?.schedule?.startDateTime === "string" &&
          new Date(b.schedule.startDateTime).getTime() > Date.now()
      )
      .sort(
       (a, b) => {
  const aTime = a?.schedule?.startDateTime
    ? new Date(a.schedule.startDateTime).getTime()
    : Infinity;

  const bTime = b?.schedule?.startDateTime
    ? new Date(b.schedule.startDateTime).getTime()
    : Infinity;

  return aTime - bTime;
}
      );

    return upcoming[0] || null;
  }, [activeBookings]);

  const booking = todayBooking || nextBooking;

  const firstWorker =
    booking?.assignedWorkers?.[0]?.worker ||
    booking?.assignedWorkers?.[0]?.workerId;

  const workerName = firstWorker?.fullName || "No worker assigned";

  const workerImage =
    firstWorker?.profilePictureUrl ||
    `https://ui-avatars.com/api/?name=${workerName}`;
  console.log(booking);
const serviceMap = useMemo(() => {
  return new Map(
    (services ?? []).map(s => [String(s._id), s.name])
  );
}, [services]);

const serviceName =
  serviceMap.get(String(booking?.serviceId)) ?? "Service";

  const status = booking?.status || "REQUESTED";

  const { isAssigned, isStarted, showTracking, isPaid } =
    getBookingFlags(status, !!firstWorker);

  const progress = useMemo(() => {
    if (!status) return 20;
    return progressMap[status as BookingStatus] ?? 20;
  }, [status]);

  if (loading) {
    return (
      <div className="rounded-2xl p-6 text-center text-gray-500">
       <CommonSpinner size={20}/>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="rounded-2xl p-6 text-center text-gray-500">
        {t.home["No active bookings found"]}
      </div>
    );
  }

  return (
  
  <CommonCard
    className="hover:border-blue-500 transition-all"
  >
    {/* HEADER */}
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <span className="relative w-2.5 h-2.5 bg-green-500 rounded-full">
          <span className="absolute -inset-1 bg-green-500 rounded-full opacity-40 animate-pulse"></span>
        </span>

        <span className="font-semibold text-lg">
          {serviceName}
        </span>

        {showTracking && (
          <span className="px-3 py-1 bg-green-100 text-green-700 border rounded-full text-xs font-semibold uppercase">
            {isAssigned && !isStarted
              ? "assigned"
              : status.replace(/_/g, " ").toLowerCase()}
          </span>
        )}
      </div>

      {isStarted && (
        <span className="text-blue-600 font-semibold">
          {progress}%
        </span>
      )}
    </div>

    {/* WORKER INFO */}
    <div className="flex items-center gap-3 mb-4">
      <Image
        src={workerImage}
        alt={workerName}
        className="w-12 h-12 rounded-lg border object-cover"
      />

      <div>
        <div className="font-semibold">{workerName}</div>
        <div className="text-sm text-gray-400">
          {firstWorker
            ? "Assigned Professional"
            : "Waiting for worker"}
        </div>
      </div>
    </div>

    {/* TRACKING */}
    {showTracking ? (
      <>
        {isStarted && (
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex gap-3">
          {allowedStatuses.includes(status) && (
            <>
              <Button
                onClick={() =>
                  navigate(`/jobtracking/${booking._id}`)
                }
                className="flex-1 h-12 bg-blue-600 text-white rounded-xl"
              >
                {t.home.Track}
              </Button>

              <Button className="flex-1 h-12 border text-blue-600 rounded-xl">
                {t.home.Chat}
              </Button>
            </>
          )}
        </div>
      </>
    ) : isPaid ? (
      <Button
        onClick={() =>
          navigate(`/servicerating/${booking._id}`)
        }
        className="w-full h-12 bg-blue-600 text-white rounded-xl"
      >
        {t.home["Rate Service"]}
      </Button>
    ) : (
      <Button
        onClick={() => navigate(`/bookings`)}
        className="w-full h-12 bg-blue-600 text-white rounded-xl"
      >
        View Booking
      </Button>
    )}
  </CommonCard>

  );
}