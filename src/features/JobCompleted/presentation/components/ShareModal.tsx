import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { X } from "lucide-react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function ShareModal({ booking, onClose }: any) {
  if (!booking) return null;
  const { services, serviceTiers } = useServices();
 const selectedService = services?.find(
  (s: any) => s._id === booking?.serviceId
);

// 🔍 Find matching tier
const selectedTier = serviceTiers?.find(
  (t: any) => t._id === booking?.serviceTierId
);

// 📦 Message
const message = `
Booking Details

Service: ${selectedService?.name || "-"}
Tier: ${selectedTier?.displayName || "-"}
Status: ${booking?.status || "-"}
Amount: ${booking?.totalCost || 0} ${booking?.currency || ""}
Duration: ${booking?.schedule?.estimatedHours || 0} hrs
`.trim();

  const handleWhatsApp = () => {
    const phone = "919207631486";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleEmail = () => {
    const email = "abhishekpes123@gmail.com";
    const subject = "Booking Details";

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;

    window.location.href = mailto;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[320px] relative shadow-xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
        >
          <X size={18} />
        </button>

        <h2 className="font-bold text-lg mb-6 text-center">
          Share Booking
        </h2>

        {/* 🔥 Icon Row */}
        <div className="flex justify-center gap-6">

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:scale-105 transition">
              <FaWhatsapp size={24} />
            </div>
            <span className="text-sm font-medium">WhatsApp</span>
          </button>

          {/* Gmail */}
          <button
            onClick={handleEmail}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:scale-105 transition">
              <FaEnvelope size={22} />
            </div>
            <span className="text-sm font-medium">Gmail</span>
          </button>

        </div>
      </div>
    </div>
  );
}