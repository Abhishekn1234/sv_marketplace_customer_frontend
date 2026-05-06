"use client";

import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import WorkerChatPageContent from "./components/WorkerChatPageContent";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

export default function WorkerChatPage() {
  const { workerId } = useParams<{ workerId: string }>();
  const { bookings, loading } = useBookings();

  const workerData = useMemo(() => {
    for (const booking of bookings ?? []) {
      const assigned = booking.assignedWorkers?.[0];
      if (assigned?.worker && String(assigned.worker._id) === String(workerId)) {
        return { worker: assigned.worker, profile: assigned.workerProfile };
      }
    }
    return null;
  }, [bookings, workerId]);

  if (loading) return <CommonSpinner/>;
  if (!workerData) return <Splash><p style={{ color: "#ef4444", fontSize: 14 }}>Worker not found.</p></Splash>;

  const { worker, profile } = workerData;

  return (
    <WorkerChatPageContent
      workerId={workerId!}
      worker={{
        fullName: worker.fullName,
        profilePictureUrl: worker.profilePictureUrl ?? null,
        status: profile?.status?? "OFFLINE",
        phone:worker.phone??null,
        email:worker.email??null,
        _id:worker._id?? ""
       
      }}
    />
  );
}

function Splash({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "#F1EFE8" }}>
      {children}
    </div>
  );
}

