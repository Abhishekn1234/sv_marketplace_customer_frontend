import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocation} from "@/features/utils/reverse";
// import { resolveLocation } from "../helpers/resolvelocation";
import { useLanguage } from "@/features/context/LanguageContext";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import Button from "@/components/input/Button";
import { Textarea } from "@/components/input";
import { ArrowRight } from "@/components/icons";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";

export default function BookingDetailDateandmoredetails() {
  const { createBooking } = useBookings();
  
 const { serviceId,serviceTierId } = useParams();
const { services } = useServices();

const selectedService = services?.find(
  (s: any) => s._id === serviceId
);
// console.log("Selected Service in BookingDetailDateandmoredetails:", selectedService);
  const { current_location } = useAuthStore();
  const {t}=useLanguage();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
 const [loading, setLoading] = useState(false);
 const allDates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 15 }).map((_, i) => {
      const current = new Date(today);
      current.setDate(today.getDate() + i);
      return {
        day: current.toLocaleDateString("en-US", { weekday: "short" }),
        date: current.getDate(),
        fullDate: new Date(current),
      };
    });
  }, []);

 
  const datesPerPage = 7;
  const [pageStart, setPageStart] = useState(0);
  const visibleDates = allDates.slice(pageStart, pageStart + datesPerPage);

  const handlePrev = () => setPageStart((prev) => Math.max(prev - datesPerPage, 0));
  const handleNext = () =>
    setPageStart((prev) => Math.min(prev + datesPerPage, allDates.length - datesPerPage));


  const times = ["08:00 AM", "10:00 AM", "12:30 PM", "03:00 PM", "05:00 PM", "06:30 PM"];
      const selectedPricing = selectedService?.pricingTiers?.[0]; 
      // ✅ replace this with .find(...) if multiple tiers exist

      // console.log("Selected Pricing Tier:", selectedPricing);


      const unitPrice =selectedPricing?.HOURLY?.ratePerHour ?? selectedPricing?.PER_DAY?.ratePerDay ?? 0;

      const safeUnitPrice = unitPrice ?? 0;
      // console.log(selectedService);
      const vatPercent = selectedService?.vatRate ?? 0;
      // console.log("VAT Percent:", vatPercent);
      // console.log(selectedService);
      const basePrice = (duration ?? 0) * safeUnitPrice;
       // console.log(basePrice);
      const vatRate = useMemo(
        () => (basePrice * vatPercent) / 100,
        [basePrice, vatPercent]
      );

      const totalCostToSend = useMemo(
        () => basePrice + vatRate,
        [basePrice, vatRate]
      );
 const handleBooking = async () => {
  try {
    setLoading(true);

    if (selectedDate === null) {
      setLoading(false);
      return toast.error("Please select a date");
    }

    if (selectedTime === null) {
      setLoading(false);
      return toast.error("Please select a time");
    }

    const today = new Date();
    const selectedDateObj = new Date(today);
    selectedDateObj.setDate(today.getDate() + selectedDate);

    const [time, modifier] = times[selectedTime].split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

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
      numberOfWorkers: 1,
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
    toast.error(error?.message || "Booking failed");
  } finally {
    // ✅ ALWAYS stop loader
    setLoading(false);
  }
};

  const increaseDuration = () => setDuration((prev) => prev + 1);
  const decreaseDuration = () => setDuration((prev) => (prev > 1 ? prev - 1 : 1));

  return (
 <CommonCard className="border-2 border-gray-200 rounded-2xl p-6">
  
  {/* Select Date */}
  <div>
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-sm font-bold text-gray-900">
        {t.bookingdetailpage.selectDate}
      </h2>

      <div className="flex gap-2">
        <Button
          onClick={handlePrev}
          disabled={pageStart === 0}
          className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200 disabled:opacity-50"
        >
          ←
        </Button>

        <Button
          onClick={handleNext}
          disabled={
            pageStart + datesPerPage >=
            allDates.length
          }
          className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200 disabled:opacity-50"
        >
          →
        </Button>
      </div>
    </div>

    <div className="flex gap-3 overflow-x-auto">
      {visibleDates.map((item, index) => {
        const globalIndex =
          pageStart + index;

        return (
          <div
            key={globalIndex}
            onClick={() =>
              setSelectedDate(globalIndex)
            }
            className={`flex h-[80px] min-w-[72px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition

              ${
                selectedDate === globalIndex
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-600"
              }
            `}
          >
            <span className="text-xs font-bold uppercase">
              {item.day}
            </span>

            <span className="text-2xl font-black">
              {item.date}
            </span>
          </div>
        );
      })}
    </div>
  </div>

  {/* Select Time */}
  <div className="mt-6">
    <h2 className="mb-4 text-sm font-bold text-gray-900">
      {t.bookingdetailpage.selectTime}
    </h2>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {times.map((time, index) => (
        <div
          key={index}
          onClick={() =>
            setSelectedTime(index)
          }
          className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-4 text-sm font-semibold transition-all

            ${
              selectedTime === index
                ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                : "border-gray-200 bg-white hover:border-blue-600"
            }
          `}
        >
          {time}
        </div>
      ))}
    </div>
  </div>

  {/* Duration */}
  <div className="mt-6">
    <h2 className="mb-4 text-sm font-bold text-gray-900">
      {t.bookingdetailpage.estimatedDuration}
    </h2>

    <div className="flex items-center gap-4 rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
      <Button
        onClick={decreaseDuration}
        className="h-10 w-10 rounded-lg bg-white"
      >
        −
      </Button>

      <div className="flex-1 text-center">
        <span className="text-3xl font-black">
          {duration}
        </span>

        <span className="ml-2 text-sm font-semibold text-gray-500">
          Hours
        </span>
      </div>

      <Button
        onClick={increaseDuration}
        className="h-10 w-10 rounded-lg bg-white"
      >
        +
      </Button>
    </div>
  </div>

  {/* Notes */}
  <div className="mt-6">
    <h2 className="mb-2 text-sm font-bold text-gray-900">
      {
        t.bookingdetailpage
          .specialRequirement
      }
    </h2>

    <Textarea
      value={notes}
      onChange={(e) =>
        setNotes(e.target.value)
      }
      placeholder="e.g. Focus on kitchen cabinets, be careful with the glass table..."
      className="
        h-32
        w-full
        resize-none
        rounded-lg
        border-2
        border-gray-200
        bg-white
        p-4
        text-sm
        text-gray-900
        outline-none
        transition-all
        focus:border-blue-600
        focus:ring-4
        focus:ring-blue-100
      "
    />
  </div>

  {/* Pricing */}
  <div className="mb-6 mt-6 border-t-2 border-dashed border-gray-200 pt-6">
    <div className="mb-2 flex justify-between text-sm">
      <span>
        {t.bookingdetailpage.basePrice}
        ({duration} hrs)
      </span>

      <span>
        SAR {basePrice.toFixed(2)}
      </span>
    </div>

    <div className="mb-2 flex justify-between text-sm">
      <span>
        {t.bookingdetailpage.vatRate}
      </span>

      <span>
        SAR {vatRate.toFixed(2)}
      </span>
    </div>

    <div className="mt-3 flex justify-between border-t-2 border-gray-200 pt-3">
      <span className="text-lg font-bold">
        {t.bookingdetailpage.total}
      </span>

      <span className="text-2xl font-black">
        SAR{" "}
        {totalCostToSend.toFixed(2)}
      </span>
    </div>
  </div>

  {/* Booking Button */}
  <Button
    onClick={handleBooking}
    disabled={loading}
    rightIcon={<ArrowRight />}
    className="
      h-14
      w-full
      rounded-full
      bg-blue-600
      font-bold
      text-white
      hover:bg-blue-700
      disabled:opacity-60
    "
  >
    {loading ? (
      <CommonSpinner
        size={15}
        color="white"
      />
    ) : (
      t.bookingdetailpage.confirmBooking
    )}
  </Button>
</CommonCard>
  );
}