import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocation } from "@/features/utils/reverse";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import CommonCard from "@/components/common/CommonCards";
import BookingDetailDateSelector from "./BookingDetailDateSelector";
import BookingDetailTimeAndDuration from "./BookingDetailTimeDuration";
import BookingDetailNotesAndSummary from "./BookingDetailNoteSummary";
import { handleApiError } from "@/components/common/ApiError";
import { parseTime } from "../utils/parseTime";



export default function BookingDetailDateandmoredetails() {
  const { createBooking } = useBookings();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { serviceId, serviceTierId } = useParams();
  const { services } = useServices();

  const selectedService = services?.find((s: any) => s._id === serviceId);

  const { current_location, accessToken } = useAuthStore();

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [numberOfWorkers] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPricing = selectedService?.pricingTiers?.[0];
  // ✅ replace this with .find(...) if multiple tiers exist

  const unitPrice =
    selectedPricing?.HOURLY?.ratePerHour ??
    selectedPricing?.PER_DAY?.ratePerDay ??
    0;

  const safeUnitPrice = unitPrice ?? 0;
  const vatPercent = selectedService?.vatRate ?? 0;
  const basePrice = (duration ?? 0) * safeUnitPrice;

  const vatRate = useMemo(
    () => (basePrice * vatPercent) / 100,
    [basePrice, vatPercent]
  );

  const totalCostToSend = useMemo(
    () => basePrice + vatRate,
    [basePrice, vatRate]
  );

  const handleBooking = async () => {
    if (!accessToken) {
      setShowLoginModal(true);
      return;
    }

    try {
      setLoading(true);

      if (selectedDate === null) {
        setLoading(false);
        return toast.error("Please select a date");
      }

      if (!selectedTime) {
        setLoading(false);
        return toast.error("Please select a time");
      }
      const today = new Date();
      const selectedDateObj = new Date(today);
      selectedDateObj.setDate(today.getDate() + selectedDate);

    const { hours, minutes } = parseTime(selectedTime);
     selectedDateObj.setHours(hours, minutes, 0, 0);

      if (selectedDateObj.getTime() <= new Date().getTime()) {
        setLoading(false);
        return toast.error("Please select a future time");
      }

      const addresses = current_location?.addresses ?? [];

      const homeAddress =
        addresses.find((addr) => addr.type === "home")?.value ||
        addresses.find((addr) => addr.type === "office")?.value ||
        addresses.find((addr) => addr.type === "inputValue")?.value;

      if (!homeAddress) {
        setLoading(false);
        return toast.error("Please select a address");
      }

      const { lat, lng } = await getCurrentLocation();

      const bookingType: "SCHEDULED" | "INSTANT" = "SCHEDULED";
      let pricingMode: "HOURLY" | "PER_DAY" =
        duration > 24 ? "PER_DAY" : "HOURLY";

      const estimatedDays = duration > 24 ? Math.floor(duration / 24) : 0;
      const estimatedHours = duration > 24 ? duration % 24 : duration;

      const payload = {
        workDescription: notes || "Service booking",
        serviceId: serviceId!,
        serviceTierId: serviceTierId!,
        pricingMode,
        numberOfWorkers: Number(numberOfWorkers),
        bookingType,
        startDateTime: selectedDateObj.toISOString(),
        estimatedHours,
        estimatedDays,
        location: {
          type: "Point" as const,
          coordinates: [lng, lat] as [number, number],
        },
      };

      await createBooking.mutateAsync(payload);
    } catch (error: any) {
      handleApiError(error)
    } finally {
      // ✅ ALWAYS stop loader
      setLoading(false);
    }
  };

  const increaseDuration = () => setDuration((prev) => prev + 1);
  const decreaseDuration = () =>
    setDuration((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <CommonCard className="border-2 border-gray-200 rounded-2xl p-6">
      <BookingDetailDateSelector
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <BookingDetailTimeAndDuration
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
        duration={duration}
        selectedDate={selectedDate}
        onIncreaseDuration={increaseDuration}
        onDecreaseDuration={decreaseDuration}
      />

      <BookingDetailNotesAndSummary
        notes={notes}
        onNotesChange={setNotes}
        duration={duration}
        basePrice={basePrice}
        vatRate={vatRate}
        totalCostToSend={totalCostToSend}
        loading={loading}
        onConfirmBooking={handleBooking}
        showLoginModal={showLoginModal}
      />
    </CommonCard>
  );
}