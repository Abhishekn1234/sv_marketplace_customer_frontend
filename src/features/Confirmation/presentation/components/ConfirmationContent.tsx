import { Link, useNavigate, useParams } from "react-router-dom";
import SummaryItem from "./SummaryItem";
import NextStep from "./Nextstep";
import { useBookingById } from "@/features/Bookings/presentation/hooks/useBookingById";
import { formatSmartDate } from "../helpers/formatdatetime";
import { getPlaceNameFromCoords } from "../helpers/map";
import { useEffect, useState } from "react";

export default function ConfirmationContent() {
const {bookingId}=useParams();
const {data,error,isLoading}=useBookingById(bookingId);
//  console.log("Booking data in ConfirmationContent:", data);
 const [placeName, setPlaceName] = useState<string>("Loading...");
 const navigate = useNavigate();
 useEffect(() => {
  const fetchPlace = async () => {
    if (!data?.location?.coordinates) return;

    const lat = data.location.coordinates[1];
    const lng = data.location.coordinates[0];

    const place = await getPlaceNameFromCoords(lat, lng);
    setPlaceName(place);
  };

  fetchPlace();
}, [data]);
if(error){
    return(
        <>
        <p className="text-red-500">Error loading booking details: {error.message}</p>
        </>
    )
}
if (isLoading || !data) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-81px)] bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Text */}
        <p className="text-gray-500 font-medium">Loading booking details...</p>

      </div>
    </div>
  );
}

  return (
    <main className="flex flex-col items-center justify-center 
                     min-h-[calc(100vh-81px)] 
                     px-4 sm:px-6 py-8 sm:py-12 
                     bg-gray-50">

      <div className="max-w-[700px] w-full text-center">

        {/* Success Icon */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8 
                        rounded-full bg-emerald-100 border-4 border-emerald-200 
                        flex items-center justify-center 
                        animate-[bounce_0.6s_ease-in-out]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-10 h-10 sm:w-14 sm:h-14 text-emerald-500"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-[42px] 
                       font-bold text-gray-900 
                       mb-3 tracking-tight">
          Booking Confirmed!
        </h1>

        <p className="text-base sm:text-lg text-gray-500 font-medium mb-8">
          Your request has been successfully received and confirmed.
        </p>

        {/* Reference Badge */}
        <div className="inline-flex flex-wrap items-center justify-center 
                        gap-2 sm:gap-3 px-5 py-3 mb-8 sm:mb-10 
                        bg-white border-2 border-gray-200 
                        rounded-full shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Reference ID
          </span>
          <span className="text-sm sm:text-base font-bold text-gray-900">
            {bookingId}
          </span>
        </div>

        {/* Summary Card */}
        <div className="bg-white border-2 border-gray-200 
                        rounded-2xl sm:rounded-3xl 
                        overflow-hidden mb-8 shadow-lg text-left">

          {/* Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 
                          bg-gray-50 border-b-2 border-gray-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Booking Summary
            </h3>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-6 py-6 sm:py-8">

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-6">

              <SummaryItem label="Service" value={data?.serviceId.name} />

              <SummaryItem
                label="Tier"
                value={
                  <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-amber-500 fill-amber-500"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {data?.serviceTierId.displayName}
                  </div>
                }
              />

              <SummaryItem label="Time & Date" value={formatSmartDate(data?.schedule?.startDateTime)} />
              <SummaryItem label="Location" value={placeName} />

              <SummaryItem
  label="Duration"
  value={
    data?.pricingMode === "HOURLY"
      ? `${data.schedule?.estimatedHours ?? 0} Hours`
      : data?.pricingMode === "PER_DAY"
      ? `${data.estimatedDays ?? 0} Days`
      : "N/A"
  }
/>

              <SummaryItem
                label="Total Paid"
                value={<span className="text-blue-600">{data?.currency} {data?.amount}</span>}
              />
            </div>

            {/* Info Alert */}
            <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 
                            bg-emerald-50 border-2 border-emerald-200 
                            rounded-xl sm:rounded-2xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 
                              bg-emerald-100 rounded-full 
                              flex items-center justify-center 
                              flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  Provider Assignment in Progress
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Our system is automatically assigning the best available provider for your area.
                  You'll receive a notification once confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full h-12 sm:h-14 
                           bg-blue-600 hover:bg-blue-700 
                           text-white font-bold 
                           rounded-full 
                           flex items-center justify-center gap-2
                           transition-all duration-200 
                           hover:-translate-y-1 mb-6 cursor-pointer" onClick={()=>navigate(`/jobtracking/${bookingId}`)}>
          Track Job Status
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Action Links */}
       {/* Action Links */}
<div className="flex flex-col sm:flex-row 
                justify-center items-center 
                gap-4 sm:gap-8 
                mb-10 text-sm font-bold uppercase tracking-wide">

  {/* Home */}
  <Link 
    to="/" 
    className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition"
  >
    {/* Home Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4.5l9 5.25M4.5 10.5v9h15v-9" />
    </svg>
    <span>Return Home</span>
  </Link>

  {/* Divider */}
  <span className="hidden sm:block text-gray-300">•</span>

  {/* View Bookings */}
  <Link 
    to="/bookings" 
    className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition"
  >
    {/* Calendar Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
    </svg>
    <span>View All Bookings</span>
  </Link>

</div>


        {/* What's Next */}
        <div className="bg-white border-2 border-gray-200 
                        rounded-xl sm:rounded-2xl p-5 sm:p-6 text-left">

          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
            What's Next?
          </h3>

          <div className="flex flex-col gap-4">

            <NextStep number="1" title="Provider Assignment"
              description="We'll match you with a top-rated professional" />

            <NextStep number="2" title="Confirmation Call"
              description="Your provider will contact you to confirm details" />

            <NextStep number="3" title="Service Delivery"
              description="Enjoy professional service at your scheduled time" />
          </div>
        </div>

      </div>
    </main>
  );
}




