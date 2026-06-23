import { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";

interface Task {
  title: string;
  status: "completed" | "progress" | "cancelled";
  time: string;
}

export const getJobProgressTasks = (
  booking: any,
 translations:any
): Task[] => {
  const activities = booking?.activities ?? [];

  const sortedActivities = [...activities]
    .filter((a: any) => a?.createdAt)
    .sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );

  const bookingCompleted =
    booking?.status === BookingStatus.COMPLETED ||
    booking?.status === BookingStatus.PAID;

  return sortedActivities.map(
    (a: any, index: number, arr: any[]) => {
      const isLast = index === arr.length - 1;

      const isCancelled =
        a.type === BookingStatus.WORKER_CANCELLED ||
        a.type === BookingStatus.CUSTOMER_CANCELLED ||
        a.type === BookingStatus.WORKER_REJECTED ||
        a.type === BookingStatus.CUSTOMER_REJECTED;

      let status: Task["status"] = "completed";

      if (isCancelled) {
        status = "cancelled";
      } else if (!bookingCompleted && isLast) {
        status = "progress";
      }

      return {
        title:
          translations[a.type as keyof typeof translations] ?? a.type,
        status,
        time: a.createdAt,
      };
    }
  );
};