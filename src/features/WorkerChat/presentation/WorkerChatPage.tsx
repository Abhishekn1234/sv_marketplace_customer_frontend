"use client";

import { useMemo } from "react";
import { useParams } from "react-router-dom";

import WorkerChatPageContent from "./components/WorkerChatPageContent";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useAuthStore } from "@/features/core/store/auth";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { Splash } from "./components/Splash";

export default function WorkerChatPage() {
  const { bookingId } =
    useParams<{ bookingId: string }>();

  const token = useAuthStore((state) => state.accessToken);
  const currentUserId = useAuthStore((state) => state.user?._id);

  const { bookings = [], loading } = useBookings();

  const isValidRoute =
    bookingId && bookingId !== "undefined";

  const workerData = useMemo(() => {
    if (!isValidRoute || !bookings.length) return null;

    const booking = bookings.find(
      (b: any) => String(b._id) === String(bookingId)
    );

    if (!booking) return null;

    const assigned =
      booking.assignedWorkers?.[0] || null;

    if (!assigned) return null;

    const worker = assigned.worker || assigned.workerId;
    const profile = assigned.workerProfile;

    return {
      worker,
      profile,
      bookingId: booking._id,
    };
  }, [bookings, bookingId, isValidRoute]);

  if (!token || !currentUserId || loading) {
    return <CommonSpinner />;
  }

  if (!isValidRoute) {
    return (
      <Splash>
        <p>Invalid chat route</p>
      </Splash>
    );
  }

  if (!workerData) {
    return <CommonSpinner center />;
  }

  const { worker, profile } = workerData;

  return (
    <WorkerChatPageContent
      bookingId={bookingId!}
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