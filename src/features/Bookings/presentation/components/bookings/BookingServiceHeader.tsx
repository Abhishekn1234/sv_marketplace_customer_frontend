import { X } from "lucide-react";
import type { Service } from "../../../domain/entities/service.types";
import { Button } from "@/components/ui/button";

interface BookingServiceHeaderProps {
  service: Service;
  onClose?: () => void;
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
      <Button
        onClick={onClose}
        variant="ghost"
        className=" "
      >
        <X size={24} />
      </Button>
    </div>
  );
}