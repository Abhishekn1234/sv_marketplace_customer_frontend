import { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { JobProgressCard } from "./JobProgressCard";
import { JobProgressInfo } from "./JobProgressInfo";
import { JobProgressProgress } from "./JobProgressProgress";
import ProviderWorkingCard from "./JobProgressProviderWorkerCard";
interface Props{
  booking:Booking;
  loading:boolean;
}
export default function JobProgressContents({ booking, loading }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
      
      {/* Left */}
      <div className="flex flex-col gap-6">
        <JobProgressProgress booking={booking} loading={loading} />
        <JobProgressCard booking={booking} />
        <ProviderWorkingCard booking={booking} />
      </div>

      {/* Right */}
      <JobProgressInfo booking={booking} />
    </div>
  );
}