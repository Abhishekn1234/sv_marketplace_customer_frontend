import { Link, useParams } from "react-router-dom";

import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";

export default function ServiceDetailBreadcrumb() {
  const { id } = useParams();
  const { data:categories} = useServiceCategory();
//   console.log(services);
  // Find service by id
  const selectedService = categories?.find(
    (service: any) => service._id === id
  );

  return (
    <nav className="flex items-center gap-2 mb-6 text-sm font-medium">
      
      {/* Home */}
      <Link
        to="/"
        className="text-gray-400 hover:text-blue-600 transition-colors"
      >
        Home
      </Link>

      {/* Arrow */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4 text-gray-400"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>

      {/* Dynamic Service Name */}
      <span className="text-gray-900 font-semibold">
        {selectedService?.name}
      </span>
    </nav>
  );
}

