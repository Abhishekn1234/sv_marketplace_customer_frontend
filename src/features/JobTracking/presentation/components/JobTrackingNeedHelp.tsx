import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function JobTrackingNeedHelp() {
 const { cancelBooking } = useBookings();
  const { bookingId } = useParams<{ bookingId: string }>(); 
     const navigate = useNavigate();
     const helpnavigate=()=>{
      navigate('/help');
     }
    const handleCancel = () => {
    if (!bookingId) return;

    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold mb-3">
            Are you sure you want to cancel this booking?
          </p>

          <div className="flex gap-2 justify-end">
            {/* No */}
            <button
              onClick={() => closeToast?.()}
              className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              No
            </button>

            {/* Yes */}
            <button
              onClick={async () => {
                try {
                  await cancelBooking({ bookingId });

                  closeToast?.();

                  toast.success("Your booking is cancelled ✅");

                  setTimeout(() => {
                    navigate("/"); 
                  }, 1500);

                } catch (error) {
                  console.error(error);
                }
              }}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };
  const options = [
    {
      text: "Contact Support",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      action:helpnavigate
    },
    {
      text: "Chat with Us",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      text: "Cancel Booking",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-5 h-5"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      ),
       action: handleCancel
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">Need Help?</h3>
      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => (
          <div
            key={idx}
              onClick={opt.action}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 transition-colors group-hover:bg-blue-50 group-hover:border-blue-600">
              {opt.icon}
            </div>
            <span className="text-sm font-semibold text-gray-900">{opt.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
