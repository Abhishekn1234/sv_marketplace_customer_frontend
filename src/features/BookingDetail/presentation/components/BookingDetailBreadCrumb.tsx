import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useNavigate, useParams } from "react-router-dom";

export default function BookingDetailBreadCrumb() {
    const navigate=useNavigate();
    const {serviceId}=useParams();
    console.log(serviceId);
    const id=serviceId;
  
    const services=useServices();
    console.log(services);
    const categoryname=services.services.find((service) => service._id === id);
   const category=categoryname?.category._id
  return (
    <button
      onClick={() => navigate(`/services/${category}`)}
      className="
        flex items-center gap-2 mb-6 text-sm font-semibold mt-24 
        text-gray-400 hover:text-blue-600 transition-colors duration-200
        focus:outline-none
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
      Back to Services
    </button>
  );
}
