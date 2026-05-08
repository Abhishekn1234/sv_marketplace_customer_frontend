"use client";

import { useMemo } from "react";
import { useParams } from "react-router-dom";

import WorkerChatPageContent from "./components/WorkerChatPageContent";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useAuthStore } from "@/features/core/store/auth";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";

export default function WorkerChatPage() {
  const { workerId, bookingId } =
    useParams<{ workerId: string; bookingId: string }>();

  const token = useAuthStore((state) => state.accessToken);
  const currentUserId = useAuthStore((state) => state.user?._id);
  const { bookings: bookings = [] } = useBookings();

  const workerData = useMemo(() => {
    if (!bookingId || !workerId || !bookings?.length) return null;

    const booking = bookings.find(
      (b: any) => String(b._id) === String(bookingId)
    );

    if (!booking) return null;

    const assigned = booking.assignedWorkers?.find(
      (aw: any) =>
        aw?.worker?._id &&
        String(aw.worker._id) === String(workerId)
    );

    if (!assigned) return null;

    return {
      worker: assigned.worker,
      profile: assigned.workerProfile,
      bookingId: booking._id,
    };
  }, [bookings, bookingId, workerId]);

  if (!token || !currentUserId) {
    return <CommonSpinner />;
  }

  if (!workerId || !bookingId) {
    return (
      <Splash>
        <p>Invalid route.</p>
      </Splash>
    );
  }

  if (!workerData) {
    return (
      <Splash>
        <p>Worker or booking not found.</p>
      </Splash>
    );
  }

  const { worker, profile } = workerData;

  return (
    <WorkerChatPageContent
      workerId={workerId}
      bookingId={bookingId}
      token={token}
      currentUserId={currentUserId}
      worker={{
        fullName: worker.fullName,
        profilePictureUrl: worker.profilePictureUrl ?? null,
        status: profile?.status ?? "OFFLINE",
        phone: worker.phone ?? null,
        email: worker.email ?? null,
        _id: worker._id ?? "",
      }}
    />
  );
}

function Splash({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-3 bg-[#F1EFE8] px-4">
      <div className="rounded-2xl border border-red-100 bg-white px-5 py-4 text-center text-sm font-medium text-red-500 shadow-sm">
        {children}
      </div>
    </div>
  );
}
