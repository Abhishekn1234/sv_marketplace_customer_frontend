import { useEffect, useMemo, useState } from "react";
import { Package, FileText } from "lucide-react";

import { useBookings } from "./hooks/useBookings";
import { useServices } from "./hooks/useServices";
import { useLocationName } from "./hooks/useLocationName";
import { useBookingActions } from "./hooks/useBookingActions";

import type { Booking, ServiceTierRef } from "../domain/entities/booking.types";
import type { Service } from "../domain/entities/service.types";

export default function MyBookings() {
  /* ------------------------------------------------------------------ */
  /* USER */
  /* ------------------------------------------------------------------ */

 

  /* ------------------------------------------------------------------ */
  /* DATA FETCHING */
  /* ------------------------------------------------------------------ */

  const { bookings , loading, error } = useBookings();
  console.log("Bookings data:", bookings);
  const { services = [], serviceTiers = [] } = useServices();
  const { cancelBooking} = useBookingActions({
    onSuccess: () => console.log("Action successful"),
    onError: (err: any) => console.error(err),
  });
  // messageProvider 

  /* ------------------------------------------------------------------ */
  /* LOCAL STATE */
  /* ------------------------------------------------------------------ */

  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  /* ------------------------------------------------------------------ */
  /* SELECT CURRENT BOOKING */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!bookings || bookings.length === 0) {
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
        ? serviceTiers.find((t) => String(t._id) === String(serviceTierId)) || null
        : null,
    [serviceTiers, serviceTierId]
  );

  /* ------------------------------------------------------------------ */
  /* LOCATION */
  /* ------------------------------------------------------------------ */

  const { locationName } = useLocationName(currentBooking?.location?.coordinates);

  /* ------------------------------------------------------------------ */
  /* ACTION HANDLERS */
  /* ------------------------------------------------------------------ */

const handleCancelBooking = async (bookingId: string): Promise<void> => {
  if (!bookingId) return;
  await cancelBooking(bookingId);
};


  // const handleMessageProvider = async (message: string): Promise<boolean> => {
  //   if (!currentBooking?._id) return false;
  //   return messageProvider(currentBooking._id, message);
  // };

  const handlePrintBooking = () => {
    if (!currentBooking) return;
    window.print(); // simple print, can customize to print only the card
  };

  /* ------------------------------------------------------------------ */
  /* LOADING / ERROR STATES */
  /* ------------------------------------------------------------------ */

  if (loading) return <div className="p-8 text-center">Loading bookings...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error loading bookings: {String(error)}</div>;
  if (!bookings || bookings.length === 0)
    return <div className="p-8 text-center">No bookings found.</div>;

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-500">Manage and track all your service bookings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl shadow border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100">
                      <Package className="text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">{currentService?.name || "Unknown Service"}</h2>
                      <p className="text-sm text-gray-500">
                        Booking #{currentBooking?._id || "N/A"}
                      </p>

                      <p className="text-sm text-gray-400">Type: {currentBooking?.bookingType || "-"}</p>
                      <p className="text-sm text-gray-400">Amount: {currentBooking?.amount} {currentBooking?.currency}</p>
                      <p className="text-sm text-gray-400">Status: {currentBooking?.status}</p>
                      <p className="text-sm text-gray-400">Workers: {currentBooking?.numberOfWorkers}</p>

                      {currentTier && <p className="text-sm text-gray-400">Tier: {currentTier.displayName}</p>}
                      {locationName && <p className="text-sm text-gray-400">Location: {locationName}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-semibold">Work Description</h3>
                </div>
                <p className="p-4 rounded-xl">{currentBooking?.workDescription || "No description available"}</p>
              </div>

              {/* ACTION BUTTONS BELOW CARD */}
              <div className="p-6 flex gap-4">
              <button
  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600"
  onClick={() => currentBooking?._id && handleCancelBooking(currentBooking._id)}
>
  Cancel Booking
</button>


                <button
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600"
                  onClick={handlePrintBooking}
                >
                  Print Booking
                </button>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
         
        </div>
      </div>
    </div>
  );
}
