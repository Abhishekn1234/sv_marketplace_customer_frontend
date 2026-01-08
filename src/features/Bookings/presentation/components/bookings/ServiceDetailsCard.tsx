import { Package, DollarSign, Users } from "lucide-react";
import { InfoCard } from "./InfoCard";
import type { Booking, ServiceTierRef } from "../../../domain/entities/booking.types";

interface ServiceDetailsCardProps {
  booking: Booking;
  serviceTier: ServiceTierRef | null;
}

export const ServiceDetailsCard = ({ booking, serviceTier }: ServiceDetailsCardProps) => (
  <div className=" rounded-2xl shadow-lg border border-gray-200 p-6">
    <h3 className="text-lg font-semibold  mb-4">Service Details</h3>
    <div className="space-y-4">
      <InfoCard
        icon={<Package className="w-5 h-5 text-blue-600" />}
        label="Service Tier"
        value={serviceTier?.displayName || serviceTier?.name || "Standard"}
      />
      <InfoCard
        icon={<DollarSign className="w-5 h-5 text-green-600" />}
        label="Pricing Mode"
        value={booking.pricingMode.replace("_", " ")}
      />
      <InfoCard
        icon={<Users className="w-5 h-5 text-purple-600" />}
        label="Workers Assigned"
        value={booking.numberOfWorkers}
      />
    </div>
  </div>
);