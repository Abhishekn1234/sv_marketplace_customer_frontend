import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";

export default function JobTrackingTimeline() {
  const { data } = useBookingHistory();
  const { bookingId } = useParams<{ bookingId: string }>();

  const booking = useMemo(() => {
    if (!data?.pages || !bookingId) return null;

    return data.pages
      .flatMap((page) => page.data)
      .find((b) => b._id === bookingId);
  }, [data, bookingId]);

  const steps = useMemo(() => {
    if (!booking) return [];

    const worker = booking.assignedWorkers?.[0];
    // console.log(booking);
    return [
      {
        title: "Booking Confirmed",
        time: formatDates(booking.createdAt),
        status: "completed",
      },
      {
        title: "Professional Assigned",
        time: formatDates(worker?.assignedAt),
        status: worker?.assignedAt ? "completed" : "pending",
      },
      {
        title: "Service Started",
        time: formatDates(worker?.startedAt),
        status: worker?.startedAt
  ? "completed"
  : booking.status === "IN_PROGRESS" || booking.status === "WORK_COMPLETED_PENDING"
  ? "active"
  : "pending",
      },
      {
        title: "Service Completed",
        time: worker?.completedAt
          ? new Date(worker.completedAt).toLocaleString()
          : "Pending",
        status: worker?.completedAt
          ? "completed"
          : booking.status === "COMPLETED"
          ? "active"
          : "pending",
      },
      {
        title: "Invoice Generated",
        time: booking.invoiceId
          ? new Date(booking.updatedAt).toLocaleString()
          : "Pending",
        status:
          booking.status === "INVOICE_GENERATED"
            ? "completed"
            : "pending",
      },
    ];
  }, [booking]);

  if (!booking) return null;

  return (
    <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-lg font-bold text-gray-900">Service Progress</h2>

        <div className="px-4 py-1 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-full">
          {booking.status}
        </div>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-2 top-2 bottom-10 w-0.5 bg-gray-200"></div>

        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          const dotClasses =
            step.status === "completed"
              ? "bg-emerald-500"
              : step.status === "active"
              ? "bg-blue-600 animate-pulse"
              : "bg-gray-200";

          return (
            <div key={idx} className={`relative pb-7 ${isLast ? "pb-0" : ""}`}>
              <div
                className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm ${dotClasses}`}
              />

              <div
                className={`bg-gray-50 border rounded-xl p-4 ${
                  step.status === "active"
                    ? "bg-blue-50 border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    step.status === "active"
                      ? "text-blue-600"
                      : "text-gray-900"
                  }`}
                >
                  {step.title}
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  {step.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
