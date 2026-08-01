"use client";

import { useMemo } from "react";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { progressMap } from "../../utils/progressmap";
import { getBookingFlags } from "../../utils/getbookingflags";
import { useLanguage } from "@/features/context/LanguageContext";
import type { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";

import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";

import ActiveServiceHeader from "./ActiveServiceHeader";
import ActiveServiceWorkerInfo from "./ActiveServiceWorkerInfo";
import ActiveServiceActions from "./ActiveServiceActions";



const CANCELLED_STATUSES = ["WORKER_CANCELLED", "CUSTOMER_CANCELLED"];

export default function ActiveService() {
  const { bookings, loading } = useBookings();
  const { t,localize } = useLanguage();


  // =========================
  // FILTER BOOKINGS
  // =========================
 const activeBookings = useMemo(() => {
  return (bookings || []).filter(
    (b) => !CANCELLED_STATUSES.includes(b.status)
  );
}, [bookings]);
  // =========================
  // TODAY BOOKING
  // =========================
  const today = new Date().toDateString();

  const todayBooking = useMemo(() => {
    return activeBookings.find((b) => {
      const dateStr = b?.schedule?.startDateTime || b?.createdAt;

      if (!dateStr) return false;

      const d = new Date(dateStr);

      return !isNaN(d.getTime()) && d.toDateString() === today;
    });
  }, [activeBookings, today]);

  // =========================
  // NEXT BOOKING
  // =========================
  const nextBooking = useMemo(() => {
    const upcoming = activeBookings
      .filter(
        (b) =>
          typeof b?.schedule?.startDateTime === "string" &&
          new Date(b.schedule.startDateTime).getTime() > Date.now()
      )
      .sort((a, b) => {
        const aTime = a?.schedule?.startDateTime
          ? new Date(a.schedule.startDateTime).getTime()
          : Infinity;

        const bTime = b?.schedule?.startDateTime
          ? new Date(b.schedule.startDateTime).getTime()
          : Infinity;

        return aTime - bTime;
      });

    return upcoming[0] || null;
  }, [activeBookings]);

  // =========================
  // SELECT BOOKING
  // =========================
  const booking = todayBooking || nextBooking;

  // =========================
  // WORKER DETAILS
  // =========================
  const firstWorker =
    booking?.assignedWorkers?.[0]?.worker ||
    booking?.assignedWorkers?.[0]?.workerId;

  const workerName = firstWorker?.fullName || t.common["No worker is assigned"];

  const workerImage =
    firstWorker?.profilePictureUrl ||
    `https://ui-avatars.com/api/?name=${workerName}`;

  // =========================
  // SERVICE NAME
  // =========================
      const serviceName = localize(booking?.service?.name) ?? "No Service";

        // console.log(serviceName);

  
    const status = booking?.status;

      const { isAssigned, isStarted, showTracking, isPaid } = getBookingFlags(
        status,
        !!firstWorker
      );

  // =========================
  // PROGRESS
  // =========================
  const progress = useMemo(() => {
    if (!status) return 20;

    return progressMap[status as BookingStatus];
  }, [status]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="rounded-2xl p-6 text-center text-gray-500">
        <CommonSpinner size={20} center />
      </div>
    );
  }

  // =========================
  // NO ACTIVE BOOKINGS
  // =========================
  if (!booking) {
    return (
      <div className="rounded-2xl p-6 text-center text-gray-500">
        {t.home["No active bookings found"]}
      </div>
    );
  }

  return (
    <CommonCard className="hover:border-blue-500 transition-all">
      <ActiveServiceHeader
        serviceName={serviceName}
        status={status}
        progress={progress}
        showTracking={showTracking}
        isAssigned={isAssigned}
        isStarted={isStarted}
      />

          <ActiveServiceWorkerInfo
      workerName={workerName}
      workerImage={workerImage}
      hasWorker={!!firstWorker}
      assignedText={t.home["Assigned Professional"]}
      waitingText={t.home["Waiting for worker"]}
    />

            <ActiveServiceActions
        bookingId={booking._id}
        showTracking={showTracking}
        isPaid={isPaid}
        isStarted={isStarted}
        progress={progress}
        hasWorker={!!firstWorker}
      />
    </CommonCard>
  );
}