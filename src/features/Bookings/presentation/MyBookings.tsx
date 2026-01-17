import { useEffect, useMemo, useState, useRef } from "react";
import { Package, FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";

import { useBookings } from "./hooks/useBookings";
import { useServices } from "./hooks/useServices";
import { useLocationName } from "./hooks/useLocationName";
import { useBookingActions } from "./hooks/useBookingActions";

import type { Booking, ServiceTierRef } from "../domain/entities/booking.types";
import type { Service } from "../domain/entities/service.types";

export default function MyBookings() {
  /* ------------------------------------------------------------------ */
  /* DATA FETCHING */
  /* ------------------------------------------------------------------ */

  const { bookings, loading, error } = useBookings();
  const { services = [], serviceTiers = [] } = useServices();

  const { cancelBooking } = useBookingActions({
    onSuccess: () => console.log("Booking cancelled"),
    onError: (err: any) => console.error(err),
  });

  /* ------------------------------------------------------------------ */
  /* LOCAL STATE */
  /* ------------------------------------------------------------------ */

  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------ */
  /* SELECT CURRENT BOOKING */
  /* ------------------------------------------------------------------ */

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

    const active = sorted.find((b) =>
      ["ACTIVE", "REQUESTED", "CONFIRMED"].includes(b.status)
    );

    setCurrentBooking(active ?? sorted[0]);
  }, [bookings]);

  /* ------------------------------------------------------------------ */
  /* DERIVED IDS */
  /* ------------------------------------------------------------------ */

  const serviceId = useMemo(
    () => currentBooking?.service?._id || currentBooking?.serviceId,
    [currentBooking]
  );

  const serviceTierId = useMemo(
    () =>
      currentBooking?.serviceTier?._id ||
      currentBooking?.serviceTierId ||
      null,
    [currentBooking]
  );

  /* ------------------------------------------------------------------ */
  /* DERIVED ENTITIES */
  /* ------------------------------------------------------------------ */

  const currentService: Service | null = useMemo(
    () =>
      serviceId
        ? services.find((s) => String(s._id) === String(serviceId)) || null
        : null,
    [services, serviceId]
  );

  const currentTier: ServiceTierRef | null = useMemo(
    () =>
      serviceTierId
        ? serviceTiers.find((t) => String(t._id) === String(serviceTierId)) ||
          null
        : null,
    [serviceTiers, serviceTierId]
  );

  /* ------------------------------------------------------------------ */
  /* LOCATION */
  /* ------------------------------------------------------------------ */

  const { locationName } = useLocationName(
    currentBooking?.location?.coordinates
  );

  /* ------------------------------------------------------------------ */
  /* ACTION HANDLERS */
  /* ------------------------------------------------------------------ */

  const handleCancelBooking = async () => {
    if (!currentBooking?._id) return;
    await cancelBooking(currentBooking._id);
  };

  const handlePrintBooking = useReactToPrint({
    contentRef: printRef,
    documentTitle: `booking-${currentBooking?._id}`,
  });

  /* ------------------------------------------------------------------ */
  /* LOADING / ERROR STATES */
  /* ------------------------------------------------------------------ */

  if (loading)
    return <div className="p-8 text-center">Loading bookings...</div>;

  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        Error loading bookings: {String(error)}
      </div>
    );

  if (!currentBooking)
    return <div className="p-8 text-center">No bookings found.</div>;

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 print:p-0">

        {/* SCREEN HEADER */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-500">
            Manage and track all your service bookings
          </p>
        </div>

        {/* PRINTABLE CONTENT */}
        <div
          ref={printRef}
          className="bg-white rounded-2xl border shadow print:shadow-none print:border-none print:rounded-none"
        >
          {/* PDF HEADER */}
          <div className="p-6 border-b print:border-b-2">
            <div className="flex items-center gap-4 print:gap-0">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center print:hidden">
                <Package className="text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-bold print:text-3xl">
                  Booking Details
                </h1>
                <p className="text-sm text-gray-500 print:text-black">
                  Booking ID: {currentBooking._id}
                </p>
              </div>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm print:text-base">
            <div>
              <span className="font-semibold">Service:</span>{" "}
              {currentService?.name}
            </div>

            <div>
              <span className="font-semibold">Status:</span>{" "}
              {currentBooking.status}
            </div>

            <div>
              <span className="font-semibold">Booking Type:</span>{" "}
              {currentBooking.bookingType}
            </div>

            <div>
              <span className="font-semibold">Workers:</span>{" "}
              {currentBooking.numberOfWorkers}
            </div>

            <div>
              <span className="font-semibold">Amount:</span>{" "}
              {currentBooking.amount} {currentBooking.currency}
            </div>

            {currentTier && (
              <div>
                <span className="font-semibold">Tier:</span>{" "}
                {currentTier.displayName}
              </div>
            )}

            {locationName && (
              <div className="col-span-2">
                <span className="font-semibold">Location:</span>{" "}
                {locationName}
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 mb-2 print:gap-0">
              <FileText className="w-5 h-5 print:hidden" />
              <h3 className="font-semibold text-lg print:text-xl">
                Work Description
              </h3>
            </div>

            <div className="border p-4 text-gray-800 print:border-black">
              {currentBooking.workDescription ||
                "No description provided"}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-6 flex gap-4 print:hidden">
            <button
              onClick={handleCancelBooking}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              Cancel Booking
            </button>

            <button
              onClick={handlePrintBooking}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600"
            >
              Print Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
