import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useAuthStore } from "@/features/core/store/auth";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function BookingDetailDateandmoredetails() {
  const { createBooking } = useBookings();
  const { serviceId, serviceTierId } = useParams();
  const { customerData } = useAuthStore();

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
 console.log(setNotes);
  // ✅ Dynamic Dates (Today + next 6 days)
  const dates = useMemo(() => {
    const today = new Date();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date();
      current.setDate(today.getDate() + i);
      week.push({
        day: current.toLocaleDateString("en-US", { weekday: "short" }),
        date: current.getDate(),
      });
    }
    return week;
  }, []);

  // ✅ Time Slots
  const times = [
    "08:00 AM",
    "10:00 AM",
    "12:30 PM",
    "03:00 PM",
    "05:00 PM",
    "06:30 PM",
  ];

  // ==============================
  // 🔥 PRICING LOGIC
  // ==============================

  const basePricePerHour = 30;
  const discountPercent = 15;

  const commissionValue = 10; // 10%
  const commissionType = "PERCENTAGE"; // or "FIXED"

  const basePrice = duration * basePricePerHour;
  const discount = (basePrice * discountPercent) / 100;

  let commissionAmount = 0;

  if (commissionType === "PERCENTAGE") {
    commissionAmount = (basePrice * commissionValue) / 100;
  } else {
    commissionAmount = commissionValue;
  }

  const totalCostToSend = basePrice - discount + commissionAmount;

  // ==============================
  // ✅ BOOKING HANDLER
  // ==============================

  const handleBooking = async () => {
    try {
      if (selectedDate === null) return toast.error("Please select a date");
      if (selectedTime === null) return toast.error("Please select a time");

      const today = new Date();
      const selectedDateObj = new Date(today);
      selectedDateObj.setDate(today.getDate() + selectedDate);

      // ⏰ Convert 12hr to 24hr format
      const [time, modifier] = times[selectedTime].split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      selectedDateObj.setHours(hours, minutes, 0, 0);

      if (selectedDateObj.getTime() <= new Date().getTime())
        return toast.error("Please select a future time");

      let lat = 0;
      let lng = 0;

      const homeAddress = customerData?.current_location?.home;
      if (!homeAddress) return toast.error("No home address found");

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            homeAddress
          )}&limit=1&accept-language=en`
        );
        const data = await res.json();

        if (data.length === 0)
          return toast.error("Unable to find coordinates");

        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      } catch (error) {
        console.error("Geocoding error:", error);
        return toast.error("Failed to fetch coordinates");
      }

      const payload = {
        workDescription: notes || "Service booking",
        serviceId: serviceId!,
        serviceTierId: serviceTierId!,
        pricingMode: "HOURLY" as const,
        numberOfWorkers: 1,
        bookingType: "SCHEDULED" as const,
        startDateTime: selectedDateObj.toISOString(),
        estimatedHours: duration,
        estimatedDays: 0,

        memberDiscount: discount,
        // commissionValue,
        // commissionType,
        // commissionAmount,
        serviceFee: commissionAmount,
        totalCost: totalCostToSend,

        location: {
          type: "Point" as const,
          coordinates: [lng, lat] as [number, number],
        },
      };

      console.log("Booking Payload:", payload);
      await createBooking(payload);
    } catch (error: any) {
      console.error(error);
    }
  };

  const increaseDuration = () => setDuration((prev) => prev + 1);
  const decreaseDuration = () =>
    setDuration((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">

      {/* ================= DATE ================= */}
      <h2 className="text-sm font-bold text-gray-900 mb-4">Select Date</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
        {dates.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedDate(index)}
            className={`min-w-[72px] h-[80px] flex flex-col items-center justify-center rounded-xl border-2 cursor-pointer transition-all ${
              selectedDate === index
                ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                : "bg-white border-gray-200 hover:border-blue-600"
            }`}
          >
            <span className="text-xs font-bold uppercase">
              {item.day}
            </span>
            <span className="text-2xl font-black">{item.date}</span>
          </div>
        ))}
      </div>

      {/* ================= TIME ================= */}
      <h2 className="text-sm font-bold text-gray-900 mb-4">Select Time</h2>

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

      {/* ================= DURATION ================= */}
      <h2 className="text-sm font-bold text-gray-900 mb-4">
        Estimated Duration
      </h2>

      <div className="flex items-center gap-4 bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-6">
        <button onClick={decreaseDuration} className="w-10 h-10 bg-white rounded-lg">
          −
        </button>

        <div className="flex-1 text-center">
          <span className="text-3xl font-black">{duration}</span>
          <span className="ml-2 text-sm font-semibold text-gray-500">
            Hours
          </span>
        </div>

        <button onClick={increaseDuration} className="w-10 h-10 bg-white rounded-lg">
          +
        </button>
      </div>

      {/* ================= PRICE SUMMARY ================= */}
      <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-6">
        <div className="flex justify-between mb-2 text-sm">
          <span>Base Price ({duration} hrs)</span>
          <span>SAR {basePrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2 text-sm">
          <span>Member Discount ({discountPercent}%)</span>
          <span className="text-blue-600">
            -SAR {discount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between mb-2 text-sm">
          <span>
            Service Fee (
            {commissionType === "PERCENTAGE"
              ? `${commissionValue}%`
              : "Fixed"}
            )
          </span>
          <span>SAR {commissionAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between border-t-2 border-gray-200 pt-3 mt-3">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-black">
            SAR {totalCostToSend.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={handleBooking}
        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full"
      >
        Confirm Booking →
      </button>
    </div>
  );
}

