import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useLanguage } from "@/features/context/LanguageContext";
import { useNavigate, useParams } from "react-router-dom";

export default function BookingDetailBreadCrumb() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const {t}=useLanguage();
  const { data: categories } = useServiceCategory();

  if (!categories) return null;

  // Flatten all services from categories
  const services = categories.flatMap((category) => category.services);

  // Find current service
  const service = services.find((s) => s._id === serviceId);

  // Get category id from service
  const categoryId = service?.category?._id;

  const handleBack = () => {
    if (categoryId) {
      navigate(`/services/${categoryId}`);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="
        flex items-center gap-2 mb-6 text-sm font-semibold mt-10 
        text-gray-400 hover:text-blue-600 transition-colors duration-200
      "
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>

      {t.bookingdetailpage.backToServices}
    </button>
  );
}