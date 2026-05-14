"use client";

import { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import WorkerChatPageContent from "./components/WorkerChatPageContent";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useAuthStore } from "@/features/core/store/auth";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { toast } from "react-toastify";
import { Splash } from "./components/Splash";

export default function WorkerChatPage() {
  const { workerId, bookingId } =
    useParams<{ workerId: string; bookingId: string }>();

  const navigate = useNavigate();

  const token = useAuthStore((state) => state.accessToken);
  const currentUserId = useAuthStore((state) => state.user?._id);

  const { bookings = [], loading } = useBookings();

  // =========================
  // MUST BE BEFORE RETURNS
  // =========================
  const workerData = useMemo(() => {
    if (!bookingId || !workerId || !bookings.length) return null;

    const booking = bookings.find(
      (b: any) => String(b._id) === String(bookingId)
    );

    if (!booking) return null;

    const assigned = booking.assignedWorkers?.find((aw: any) => {
      const assignedWorkerId =
        aw?.worker?._id || aw?.workerId?._id || aw?.workerId;

      return (
        assignedWorkerId &&
        String(assignedWorkerId) === String(workerId)
      );
    });

    if (!assigned) return null;

    return {
      worker: assigned.worker || assigned.workerId,
      profile: assigned.workerProfile,
      bookingId: booking._id,
    };
  }, [bookings, bookingId, workerId]);

  // =========================
  // EFFECT MUST ALSO BE BEFORE RETURNS
  // =========================
  useEffect(() => {
    if (!loading && !workerData) {
      toast.error(
        "Worker or booking not found. Booking may be completed."
      );

      const timer = setTimeout(() => {
        navigate("/bookings", { replace: true });
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [loading, workerData, navigate]);

  // =========================
  // SAFE CONDITIONS AFTER HOOKS
  // =========================
  if (!token || !currentUserId || loading) {
    return <CommonSpinner />;
  }

  if (!workerId || !bookingId) {
    return (
      <Splash>
        <p>Invalid chat route</p>
      </Splash>
    );
  }

  if (!workerData) {
    return <CommonSpinner />;
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
