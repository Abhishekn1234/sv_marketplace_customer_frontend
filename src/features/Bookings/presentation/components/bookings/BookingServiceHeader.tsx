import { X } from "lucide-react";
import type { Service } from "../../../domain/entities/service.types";

interface BookingServiceHeaderProps {
  service: Service;
  onClose: () => void;
}

export default function BookingServiceHeader({ service, onClose }: BookingServiceHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h3 className="text-xl font-semibold">{service.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {service.description}
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full transition"
      >
        <X size={24} />
      </button>
    </div>
  );
}