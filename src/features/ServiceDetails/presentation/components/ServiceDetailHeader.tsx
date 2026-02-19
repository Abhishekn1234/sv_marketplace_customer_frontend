import { useParams } from "react-router-dom";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";

export default function ServiceDetailHeader() {
  const { id } = useParams<{ id: string }>(); 
  
  const { data: categories } = useServiceCategory();

  if ( !categories) return null;

  // Find the service that matches the ID
  const service = categories.find((s) => s._id === id);

  if (!service) return <p>Service not found</p>;

  return (
    <div className="mb-8">
      {/* Title */}
      <h1 className="text-[42px] font-bold text-gray-900 mb-3 tracking-[-0.02em]">
        {service.name}
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-500 max-w-[600px] leading-relaxed font-medium">
        {service.description}
      </p>
    </div>
  );
}
