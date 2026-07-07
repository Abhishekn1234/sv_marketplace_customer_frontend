import { Link, useParams } from "react-router-dom";

import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useLanguage } from "@/features/context/LanguageContext";
import { ArrowRight } from "@/components/icons";

export default function ServiceDetailBreadcrumb() {
  const { id } = useParams();
  const { data:categories} = useServiceCategory();
//   console.log(services);
  // Find service by id
  const {t}=useLanguage();
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
        {t.servicedetailpage.breadcrumb.Home}
      </Link>

      {/* Arrow */}
     <ArrowRight/>

      {/* Dynamic Service Name */}
      <span className="text-gray-900 font-semibold">
        {selectedService?.name}
      </span>
    </nav>
  );
}

