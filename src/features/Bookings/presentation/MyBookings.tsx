import { useEffect, useMemo, useState } from "react";
import { Package, FileText } from "lucide-react";

import { useBookings } from "./hooks/useBookings";
import { useServices } from "./hooks/useServices";
import { useLocationName } from "./hooks/useLocationName";
import { useBookingActions } from "./hooks/useBookingActions";

import type { Booking, ServiceTierRef } from "../domain/entities/booking.types";
import type { Service } from "../domain/entities/service.types";

import { LoadingState } from "./components/bookings/LoadingState";
import { ActionButtons } from "./components/bookings/ActionButtons";
import { StatusBadge } from "./components/bookings/StatusBadge";
import { ErrorState } from "./components/bookings/ErrorState";
import { ServiceDetailsCard } from "./components/bookings/ServiceDetailsCard";
import { EmptyState } from "./components/bookings/EmptyState";
import { BookingTimeline } from "./components/bookings/BookingTimeline";
import { PaymentSummaryCard } from "./components/bookings/PaymentSummaryCard";
import { ScheduleLocationCard } from "./components/bookings/ScheduleLocationCard";
import { AllBookingsList } from "./components/bookings/AllBookingsList";

export default function MyBookings() {
  /* ------------------------------------------------------------------ */
  /* USER */
  /* ------------------------------------------------------------------ */

  const customerData = localStorage.getItem("customerData");
  const parsedCustomer = customerData ? JSON.parse(customerData) : null;
  const userId: string | undefined = parsedCustomer?._id;

  /* ------------------------------------------------------------------ */
  /* DATA */
  /* ------------------------------------------------------------------ */

  const { bookings = [], loading, error } = useBookings();
  const { services = [], serviceTiers = [] } = useServices();

  const { cancelBooking, messageProvider } = useBookingActions({
    onSuccess: () => console.log("Action successful"),
    onError: (err: any) => console.error(err),
  });

  /* ------------------------------------------------------------------ */
  /* STATE */
  /* ------------------------------------------------------------------ */

  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  /* ------------------------------------------------------------------ */
  /* SELECT CURRENT BOOKING */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!bookings.length) {
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
        ? serviceTiers.find(
            (t) => String(t._id) === String(serviceTierId)
          ) || null
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
  /* STATES */
  /* ------------------------------------------------------------------ */

  if (loading) return <LoadingState />;

  if (error)
    return (
      <ErrorState
        error={error}
        onRetry={() => window.location.reload()}
      />
    );

  if (!currentBooking) return <EmptyState />;

  /* ------------------------------------------------------------------ */
  /* ACTION HANDLERS */
  /* ------------------------------------------------------------------ */

  const handleCancelBooking = async (
    bookingId: string,
    reason: string
  ): Promise<boolean> => {
    return cancelBooking(bookingId, reason);
  };

  const handleMessageProvider = async (
    message: string
  ): Promise<boolean> => {
    if (!currentBooking._id) return false;
    return messageProvider(currentBooking._id, message);
  };

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-500">
            Manage and track all your service bookings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl shadow border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                      <Package className="text-blue-600" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">
                        {currentService?.name || "Unknown Service"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Booking #{currentBooking._id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={currentBooking.status} />
                </div>
              </div>

              <BookingTimeline booking={currentBooking} />

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-semibold">Work Description</h3>
                </div>

                <p className="p-4 rounded-xl">
                  {currentBooking.workDescription}
                </p>
              </div>
            </div>

            <ActionButtons
              booking={currentBooking}
              onCancelBooking={handleCancelBooking}
              onMessageProvider={handleMessageProvider}
            />
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <ServiceDetailsCard
              booking={currentBooking}
              serviceTier={currentTier}
            />

            <ScheduleLocationCard
              startDateTime={
                currentBooking.schedule?.startDateTime || ""
              }
              estimatedDays={
                currentBooking.schedule?.estimatedDays || 0
              }
              locationName={locationName}
            />

            <PaymentSummaryCard
              amount={currentBooking.amount}
              currency={currentBooking.currency}
            />
          </div>
        </div>

        {bookings.length > 1 && (
          <AllBookingsList bookings={bookings} services={services} />
        )}
      </div>
    </div>
  );
}

