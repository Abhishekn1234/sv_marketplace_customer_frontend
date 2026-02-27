import { Link, useNavigate } from "react-router-dom";
import SummaryItem from "./SummaryItem";
import NextStep from "./Nextstep";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { formatSmartDate } from "../helpers/formatdatetime";
import { getPlaceNameFromCoords } from "@/features/utils/reverse";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Home } from "lucide-react";

export default function ConfirmationContent() {
  const { bookings, error, loading: isLoading } = useBookings();
  const navigate = useNavigate();

  // Latest booking (newest first)
  const data = bookings[0];
   
  const [placeName, setPlaceName] = useState<string>("Loading...");

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

  // Error State
  if (error) {
    return (
      <p className="text-red-500 text-center mt-10">
        Error loading booking details
      </p>
    );
  }

  // Loading State
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-81px)] bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-81px)] px-4 sm:px-6 py-8 sm:py-12 bg-gray-50">
      <div className="max-w-[700px] w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center animate-[bounce_0.6s_ease-in-out]">
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

       
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Booking{" "}
          {data.status
            ? data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()
            : ""}
        </h1>

        <p className="text-base sm:text-lg text-gray-500 font-medium mb-8">
          Your request has been successfully received and {data.status?`pending and confirmation will update by worker`:`confirmation`}.
        </p>

        {/* Reference */}
        <div className="inline-flex items-center justify-center gap-3 px-5 py-3 mb-8 bg-white border-2 border-gray-200 rounded-full shadow-sm">
          <span className="text-xs font-bold uppercase text-gray-400">
            Reference ID
          </span>
          <span className="text-sm font-bold text-gray-900">
            {data._id}
          </span>
        </div>

        {/* Summary Card */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden mb-8 shadow-lg text-left">
          <div className="px-6 py-5 bg-gray-50 border-b-2 border-gray-200">
            <h3 className="text-xs font-bold uppercase text-gray-400">
              Booking Summary
            </h3>
          </div>

          <div className="px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <SummaryItem label="Service" value={data?.serviceId.name} />

              <SummaryItem
                label="Tier"
                value={data?.serviceTierId?.displayName}
              />

              <SummaryItem
                label="Time & Date"
                value={formatSmartDate(data?.schedule?.startDateTime)}
              />

              <SummaryItem label="Location" value={placeName} />

              <SummaryItem
                label="Duration"
                value={
                  data?.pricingMode === "HOURLY"
                    ? `${data.schedule?.estimatedHours ?? 0} Hours`
                    : data?.pricingMode === "PER_DAY"
                    ? `${data.schedule?.estimatedDays ?? 0} Days`
                    : "N/A"
                }
              />

              <SummaryItem
                label="Total Paid"
                value={
                  <span className="text-blue-600">
                    {data?.currency} {data?.amount}
                  </span>
                }
              />
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-4 p-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5 text-emerald-500"
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
                <p className="text-sm text-gray-500">
                  We're assigning the best provider for your location.
                  You'll receive a notification once confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Track Button */}
        <button
          className="w-full  cursor-pointer h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition mb-6"
          onClick={() => navigate(`/jobtracking/${data._id}`)}
        >
          
         <span className="flex gap-3 justify-center"> Track Job Status <ArrowRight className="w-5"/></span>
        </button>

        {/* Links */}
        <div className="flex justify-center gap-8 mb-10 text-sm font-bold uppercase">
          <Link to="/" className="text-gray-900 hover:text-blue-600">
          <span className="flex gap-2"><Home className="w-5"/>
            Return Home</span>
         
          </Link>

          <Link to="/bookings" className="text-gray-900 hover:text-blue-600">
          <span className="flex gap-2"><Calendar className="w-5"/> View All Bookings</span>
            
          </Link>
        </div>

        {/* What's Next */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-left">
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-5">
            What's Next?
          </h3>

          <div className="flex flex-col gap-4">
            <NextStep
              number="1"
              title="Provider Assignment"
              description="We'll match you with a top-rated professional"
            />
            <NextStep
              number="2"
              title="Confirmation Call"
              description="Your provider will contact you"
            />
            <NextStep
              number="3"
              title="Service Delivery"
              description="Enjoy professional service at your scheduled time"
            />
          </div>
        </div>
      </div>
    </main>
  );
}




