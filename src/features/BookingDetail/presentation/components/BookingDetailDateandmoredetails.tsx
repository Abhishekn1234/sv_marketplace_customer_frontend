import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocation } from "@/components/utils/reverse";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import CommonCard from "@/components/common/CommonCards";
import BookingDetailDateSelector from "./BookingDetailDateSelector";
import BookingDetailTimeAndDuration from "./BookingDetailTimeDuration";
import BookingDetailNotesAndSummary from "./BookingDetailNoteSummary";
import { handleApiError } from "@/components/common/ApiError";
import { parseTime } from "../utils/parseTime";

import { useValidateCoupon } from "../hooks/useapplycouponcode";


export default function BookingDetailDateandmoredetails() {
  const { createBooking } = useBookings();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { serviceId, serviceTierId } = useParams();
  const { services } = useServices();

  const selectedService = services?.find((s: any) => s._id === serviceId);

  const { current_location, accessToken } = useAuthStore();
 const validateCoupon = useValidateCoupon();

const [couponCode, setCouponCode] = useState("");
const [appliedCouponCode, setAppliedCouponCode] = useState("");
const [couponPricing, setCouponPricing] = useState<{
  amountBeforeDiscount: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  totalCost: number;
} | null>(null);
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
    const validateCouponForDuration = async (currentDuration: number) => {
  if (!couponCode.trim()) return;

  if (selectedDate === null || !selectedTime) return;

  try {
    const today = new Date();
    const selectedDateObj = new Date(today);
    selectedDateObj.setDate(today.getDate() + selectedDate);

    const { hours, minutes } = parseTime(selectedTime);
    selectedDateObj.setHours(hours, minutes, 0, 0);

    const { lat, lng } = await getCurrentLocation();

    const pricingMode =
      currentDuration > 24 ? "PER_DAY" : "HOURLY";

    const estimatedDays =
      currentDuration > 24
        ? Math.floor(currentDuration / 24)
        : 0;

    const estimatedHours =
      currentDuration > 24
        ? currentDuration % 24
        : currentDuration;

    const response = await validateCoupon.mutateAsync({
      workDescription: notes || "Service booking",
      couponCode,
      serviceId: serviceId!,
      serviceTierId: serviceTierId!,
      pricingMode,
      numberOfWorkers,
      bookingType: "SCHEDULED",
      startDateTime: selectedDateObj.toISOString(),
      estimatedHours,
      estimatedDays,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    setCouponPricing({
      amountBeforeDiscount: response.amountBeforeDiscount,
      discountAmount: response.discountAmount,
      taxableAmount: response.taxableAmount,
      taxAmount: response.taxAmount,
      totalCost: response.totalCost,
    });

    setAppliedCouponCode(couponCode.trim());
  } catch (error) {
    handleApiError(error);
  }
};

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
  const handleApplyCoupon = async () => {
  await validateCouponForDuration(duration);
};

const increaseDuration = () => {
  const newDuration = duration + 1;
  setDuration(newDuration);

  if (couponPricing) {
    validateCouponForDuration(newDuration);
  }
};

const decreaseDuration = () => {
  if (duration === 1) return;

  const newDuration = duration - 1;
  setDuration(newDuration);

  if (couponPricing) {
    validateCouponForDuration(newDuration);
  }
};
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
        couponCode,
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

      couponCode={couponCode}
      appliedCouponCode={appliedCouponCode}
      onCouponCodeChange={setCouponCode}
      onApplyCoupon={handleApplyCoupon}
      couponLoading={validateCoupon.isPending}
      couponPricing={couponPricing}
    />
    </CommonCard>
  );
}