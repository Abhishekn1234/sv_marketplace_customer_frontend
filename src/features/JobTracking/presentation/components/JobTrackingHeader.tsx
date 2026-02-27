import { useParams } from "react-router-dom";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";

export default function JobTrackingHeader() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings } = useBookings();

  
  const booking = bookings?.find(
    (item) => item._id === bookingId
  );

  const showOtpButton = booking?.status === "WORKER_ACCEPTED";

  return (
    <div className="mb-8 flex items-start justify-between">
      
     
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
          Job Tracking
        </h1>
        <p className="text-base sm:text-lg font-medium text-gray-500">
          Track your service request in real-time
        </p>
      </div>

      
      {showOtpButton && (
        <button
          className="px-6 py-2  cursor-pointer rounded-full border-2 border-blue-600 text-blue-600 font-semibold transition-all duration-300 hover:bg-blue-600 hover:text-white"
          onClick={() => {
            console.log("Generate OTP for booking:", bookingId);
            
          }}
        >
          Generate OTP
        </button>
      )}
    </div>
  );
}