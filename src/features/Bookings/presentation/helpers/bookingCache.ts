import type { QueryClient } from "@tanstack/react-query";
import type { Booking } from "../../domain/entities/booking.types";
import type {
  BookingHistory,
  BookingHistoryResponse,
} from "../../domain/entities/bookinghistory.types";
import { bookingKeys } from "@/features/Confirmation/presentation/helpers/bookingkeys";

export type BookingSocketPayload = {
  eventName?: string;
  status?: string;
  occurredAt?: string;
  booking?: Partial<Booking & BookingHistory>;
} & Partial<Booking & BookingHistory>;

export function getBookingFromSocketPayload(payload: BookingSocketPayload) {
  return payload.booking ?? payload;
}

export function mapSocketBookingStatus(
  eventName: string,
  payload: BookingSocketPayload
) {
  const booking = getBookingFromSocketPayload(payload);
  const socketEventName = payload.eventName ?? eventName;

  switch (socketEventName) {
    case "booking.worker.accepted":
      return "WORKER_ACCEPTED";
    case "booking.work-start-otp.generated":
      return "WORK_STARTED";
    case "booking.work.started":
      return "IN_PROGRESS";
    case "booking.work.completed-by-worker":
      return "WORK_COMPLETED_BY_WORKER";
    case "booking.completion-otp.generated":
      return "WORK_COMPLETED_PENDING";
    case "booking.completion.confirmed":
      return "COMPLETED";
    case "booking.invoice.generated":
      return "INVOICE_GENERATED";
    case "booking.payment.pending":
      return "PAYMENT_PENDING";
    default:
      return payload.status ?? booking.status;
  }
}

export function updateBookingCachesFromSocket(
  queryClient: QueryClient,
  eventName: string,
  payload: BookingSocketPayload
) {
  const booking = getBookingFromSocketPayload(payload);
  const bookingId = booking?._id;

  if (!bookingId) return;

  const updatedBooking = {
    ...booking,
    status: mapSocketBookingStatus(eventName, payload),
  };

  queryClient.setQueryData<Booking[]>(bookingKeys.all, (old = []) => {
    const exists = old.some((item) => String(item._id) === String(bookingId));

    if (!exists) return [updatedBooking as Booking, ...old];

    return old.map((item) =>
      String(item._id) === String(bookingId)
        ? ({ ...item, ...updatedBooking } as Booking)
        : item
    );
  });

  queryClient.setQueryData(
    bookingKeys.detail(String(bookingId)),
    (old: Booking | undefined) => ({ ...old, ...updatedBooking })
  );

  queryClient.setQueriesData<{
    pages: BookingHistoryResponse[];
    pageParams: unknown[];
  }>({ queryKey: ["booking-history"] }, (old) => {
    if (!old?.pages) return old;

    let found = false;
    const pages = old.pages.map((page) => ({
      ...page,
      data: page.data.map((item) => {
        if (String(item._id) !== String(bookingId)) return item;
        found = true;
        return { ...item, ...updatedBooking } as BookingHistory;
      }),
    }));

    if (!found && pages[0]) {
      pages[0] = {
        ...pages[0],
        data: [updatedBooking as BookingHistory, ...pages[0].data],
      };
    }

    return { ...old, pages };
  });

  queryClient.invalidateQueries({ queryKey: ["booking-history"] });
}

export const bookingSocketEvents = [
  "booking.created",
  "booking:update",
  "booking.status.changed",
  "booking.worker.assigned",
  "booking.worker.accepted",
  "booking.work-start-otp.generated",
  "booking.work.started",
  "booking.work.completed-by-worker",
  "booking.completion-otp.generated",
  "booking.completion.confirmed",
  "booking.invoice.generated",
  "booking.payment.pending",
  "booking.cancelled.worker",
] as const;
