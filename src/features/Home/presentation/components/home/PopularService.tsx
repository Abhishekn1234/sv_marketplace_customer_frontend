import type { Category } from "@/features/Bookings/domain/entities/category.types";
import { useNavigate } from "react-router-dom";

interface Props {
  services: Category[];
}

const PopularService: React.FC<Props> = ({ services }) => {
  const navigate = useNavigate();

  if (!services.length) {
    return <p className="text-gray-400 font-medium">No services found.</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Popular Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            onClick={() => navigate(`/services/${service._id}`)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/services/${service._id}`);
            }}
            className="relative bg-white rounded-xl p-6 text-center border border-gray-200 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-transparent group"
          >
            {/* Top border animation */}
            <span className="absolute top-0 left-0 right-0 h-1 bg-blue-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>

            {/* Icon */}
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:bg-blue-100 group-hover:scale-110 group-hover:-rotate-6">
              {service.iconUrl ? (
                <img src={service.iconUrl} alt={service.name} className="w-7 h-7" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-7 h-7 text-gray-600"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              )}
            </div>

            {/* Service Name */}
            <div className="text-sm font-semibold text-gray-900 mb-1 truncate">
              {service.name}
            </div>
            

            {/* Rating */}
            {service.rating !== undefined && (
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500 font-medium">
                ⭐ {service.rating}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularService;
