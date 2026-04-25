import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocation} from "@/features/utils/reverse";
// import { resolveLocation } from "../helpers/resolvelocation";
import { useLanguage } from "@/features/context/LanguageContext";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

export default function BookingDetailDateandmoredetails() {
  const { createBooking } = useBookings();
  
 const { serviceId,serviceTierId } = useParams();
const { services } = useServices();

const selectedService = services?.find(
  (s: any) => s._id === serviceId
);
console.log("Selected Service in BookingDetailDateandmoredetails:", selectedService);
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

      console.log("Selected Pricing Tier:", selectedPricing);


      const unitPrice =selectedPricing?.HOURLY?.ratePerHour ?? selectedPricing?.PER_DAY?.ratePerDay ?? 0;

      const safeUnitPrice = unitPrice ?? 0;
      console.log(selectedService);
      const vatPercent = selectedService?.vatRate ?? 0;
      console.log("VAT Percent:", vatPercent);
      console.log(selectedService);
      const basePrice = (duration ?? 0) * safeUnitPrice;
       console.log(basePrice);
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
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
    
     <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900">{t.bookingdetailpage.selectDate}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={pageStart === 0}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              disabled={pageStart + datesPerPage >= allDates.length}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {visibleDates.map((item, index) => {
            const globalIndex = pageStart + index;
            return (
              <div
                key={globalIndex}
                onClick={() => setSelectedDate(globalIndex)}
                className={`h-[80px] flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition min-w-[72px] ${
                  selectedDate === globalIndex
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                    : "bg-white border-gray-200 hover:border-blue-600"
                }`}
              >
                <span className="text-xs font-bold uppercase">{item.day}</span>
                <span className="text-2xl font-black">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>

    
      <h2 className="text-sm font-bold text-gray-900 mb-4">{t.bookingdetailpage.selectTime}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {times.map((time, index) => (
          <div
            key={index}
            onClick={() => setSelectedTime(index)}
            className={`flex items-center justify-center p-4 rounded-xl border-2 text-sm font-semibold cursor-pointer transition-all ${
              selectedTime === index
                ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                : "bg-white border-gray-200 hover:border-blue-600"
            }`}
          >
            {time}
          </div>
        ))}
      </div>

      <h2 className="text-sm font-bold text-gray-900 mb-4">
        {t.bookingdetailpage.estimatedDuration}
      </h2>
      <div className="flex items-center gap-4 bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
        <button onClick={decreaseDuration} className="w-10 h-10 bg-white rounded-lg">−</button>
        <div className="flex-1 text-center">
          <span className="text-3xl font-black">{duration}</span>
          <span className="ml-2 text-sm font-semibold text-gray-500">Hours</span>
        </div>
        <button onClick={increaseDuration} className="w-10 h-10 bg-white rounded-lg">+</button>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-2 mt-6">{t.bookingdetailpage.specialRequirement}</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Focus on kitchen cabinets, be careful with the glass table..."
          className="w-full h-32 p-4 bg-white border-2 border-gray-200 rounded-lg text-sm text-gray-900 font-sans resize-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
        />
      </div>

      <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-6">
        <div className="flex justify-between mb-2 text-sm">
          <span>{t.bookingdetailpage.basePrice}({duration} hrs)</span>
          <span>SAR {basePrice.toFixed(2)}</span>
        </div>
       
        <div className="flex justify-between mb-2 text-sm">
          <span>{t.bookingdetailpage.vatRate}</span>
          <span>SAR {vatRate.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t-2 border-gray-200 pt-3 mt-3">
          <span className="text-lg font-bold">{t.bookingdetailpage.total}</span>
          <span className="text-2xl font-black">SAR {totalCostToSend.toFixed(2)}</span>
        </div>
      </div>

      <button
  onClick={handleBooking}
  disabled={loading}
  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-60"
>
  {loading ? (
    <>
      <svg
        className="w-5 h-5 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Processing...
    </>
  ) : (
    <>
      {t.bookingdetailpage.confirmBooking} →
    </>
  )}
</button>
    </div>
  );
}