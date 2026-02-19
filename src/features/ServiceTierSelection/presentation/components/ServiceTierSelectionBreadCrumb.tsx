import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ServiceTierSelectionBreadCrumb() {
  const { id } = useParams();
  const { services } = useServices();
 const navigate=useNavigate();
  const serviceName =
    services?.find((s) => s._id === id)?.name || "Service";

  return (
    <div className="w-full px-0 lg:px-8 py-6 mt-24">
      {/* Breadcrumb */}
      <nav className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 mb-6">
        <button
          onClick={()=>navigate(-1)}
          className="hover:text-blue-600 transition-colors cursor-pointer"
        >
          Service
        </button>

        <Chevron />

        <span className="text-gray-900 font-semibold">
          Select Tier
        </span>

        <Chevron />

        <span className="text-gray-400">Schedule</span>
      </nav>

      {/* Service Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border-2 border-gray-200 rounded-full shadow-sm">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 text-blue-600"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M15 3v18" />
            </svg>
          </div>

          <span className="text-sm font-bold text-gray-900">
            {serviceName}
          </span>
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4 text-gray-400"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
