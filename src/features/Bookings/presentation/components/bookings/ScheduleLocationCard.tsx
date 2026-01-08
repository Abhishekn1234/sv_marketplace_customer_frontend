import { Calendar, Clock, MapPin } from "lucide-react";
import { InfoCard } from "./InfoCard";

interface ScheduleLocationCardProps {
  startDateTime: string;
  estimatedDays: number;
  locationName: string;
}

export const ScheduleLocationCard = ({ 
  startDateTime, 
  estimatedDays, 
  locationName 
}: ScheduleLocationCardProps) => {
  
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "Not scheduled";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className=" rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold  mb-4">Schedule & Location</h3>
      <div className="space-y-4">
        <InfoCard
          icon={<Calendar className="w-5 h-5 text-amber-600" />}
          label="Scheduled Date"
          value={formatDateTime(startDateTime)}
        />
        <InfoCard
          icon={<Clock className="w-5 h-5 text-indigo-600" />}
          label="Estimated Days"
          value={`${estimatedDays ?? 0} day(s)`}
        />
        <div className=" rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg shadow-sm">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Location</p>
            </div>
          </div>
          <p className="text-sm mt-2">
            {locationName || "Loading location..."}
          </p>
        </div>
      </div>
    </div>
  );
};