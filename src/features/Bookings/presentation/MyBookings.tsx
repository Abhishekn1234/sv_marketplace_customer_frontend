import { useEffect, useMemo, useState, useRef } from "react";
import { AlertTriangle, Package } from "lucide-react";
import { useReactToPrint } from "react-to-print";

import { useBookings } from "./hooks/useBookings";
import { useServices } from "./hooks/useServices";
import { useLocationName } from "./hooks/useLocationName";
import { useBookingActions } from "./hooks/useBookingActions";

import type { Booking } from "../domain/entities/booking.types";
import type { Service } from "../domain/entities/service.types";
import type { ServiceTierRef } from "../domain/entities/servicetier.types";

export default function MyBookings() {
  const { bookings, loading, error } = useBookings();
  const { services = [], serviceTiers = [] } = useServices();
  console.log(bookings);
  const { cancelBooking } = useBookingActions({
    onSuccess: () => console.log("Booking cancelled"),
    onError: (err: any) => console.error(err),
  });

  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bookings?.length) {
      setCurrentBooking(null);
      return;
    }

    const sorted = [...bookings].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime()
    );

    const active = sorted.find(b =>
      ["ACTIVE", "REQUESTED", "CONFIRMED"].includes(b.status)
    );

    setCurrentBooking(active ?? sorted[0]);
  }, [bookings]);

  const serviceId = useMemo(() => {
    if (!currentBooking) return null;

    if (typeof currentBooking.service === "object") {
      return currentBooking.service._id;
    }

    return currentBooking.serviceId ?? null;
  }, [currentBooking]);

  const currentService: Service | null = useMemo(() => {
    if (!serviceId) return null;

    return (
      services.find(s => String(s._id) === String(serviceId)) || null
    );
  }, [services, serviceId]);

  const serviceTierIds: string[] = useMemo(() => {
    if (!currentBooking) return [];

    if (currentBooking.serviceTier) {
      if (Array.isArray(currentBooking.serviceTier)) {
        return currentBooking.serviceTier.map(t => String(t._id));
      }
      return [String(currentBooking.serviceTier._id)];
    }

    if (currentBooking.serviceTierId) {
      if (Array.isArray(currentBooking.serviceTierId)) {
        return currentBooking.serviceTierId.map(id => String(id));
      }
      return [String(currentBooking.serviceTierId)];
    }

    return [];
  }, [currentBooking]);

  const currentTiers: ServiceTierRef[] = useMemo(() => {
    if (!serviceTierIds.length) return [];

    return serviceTiers.filter(t =>
      serviceTierIds.includes(String(t._id))
    );
  }, [serviceTiers, serviceTierIds]);

  const startDateTimeFormatted = useMemo(() => {
    const iso = currentBooking?.schedule?.startDateTime;
    if (!iso) return null;

    const date = new Date(iso);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const time = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) return `Today at ${time}`;

    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `${formattedDate} at ${time}`;
  }, [currentBooking]);

  const { locationName } = useLocationName(
    currentBooking?.location?.coordinates
  );

  const handleCancelBooking = async () => {
    if (!currentBooking?._id) return;
    await cancelBooking(currentBooking._id);
  };

  const handlePrintBooking = useReactToPrint({
    contentRef: printRef,
    documentTitle: `booking-${currentBooking?._id}`,
  });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading bookings...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">
            Error loading bookings
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {String(error)}
          </p>
        </div>
      </div>
    );

  if (!currentBooking)
    return <div className="p-8 text-center">No bookings found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 print:p-0">
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-500">
            Manage and track all your service bookings
          </p>
        </div>

        <div
          ref={printRef}
          className="bg-white rounded-2xl border shadow print:shadow-none print:border-none"
        >
          <div className="p-6 border-b flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Package className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Booking Details</h1>
              <p className="text-sm text-gray-500">
                Booking ID: {currentBooking._id}
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div><b>Service:</b> {currentService?.name}</div>
            <div><b>Status:</b> {currentBooking.status}</div>
            <div><b>Booking Type:</b> {currentBooking.bookingType}</div>
            {startDateTimeFormatted && (
              <div><b>Start:</b> {startDateTimeFormatted}</div>
            )}
            <div><b>Workers:</b> {currentBooking.numberOfWorkers}</div>
            <div><b>Amount:</b> {currentBooking.amount} {currentBooking.currency}</div>

            {currentTiers.length > 0 && (
              <div className="col-span-2 flex gap-2 flex-wrap items-center">
                <b>Tiers:</b>
                {currentTiers.map(t => (
                  <span
                    key={t._id}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"
                  >
                    {t.displayName}
                  </span>
                ))}
              </div>
            )}

            {locationName && (
              <div className="col-span-2">
                <b>Location:</b> {locationName}
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            <h3 className="font-semibold text-lg mb-2">Work Description</h3>
            <div className="border p-4">
              {currentBooking.workDescription || "No description provided"}
            </div>
          </div>

          <div className="p-6 flex gap-4 print:hidden">
            <button
              onClick={handleCancelBooking}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold"
            >
              Cancel Booking
            </button>

            <button
              onClick={handlePrintBooking}
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold"
            >
              Print Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

