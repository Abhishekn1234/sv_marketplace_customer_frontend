import JobTrackingTimeline from "./JobTrackingTimeline";
import JobTrackingWorkerDetails from "./JobTrackingWorkerDetails";
import JobTrackingServiceDetails from "./JobTrackingServiceDetails";
import JobTrackingNeedHelp from "./JobTrackingNeedHelp";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

interface Props {
  bookings: Booking[];
  loading: boolean;
}

export default function JobTrackingLayout({ bookings, loading }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 overflow-x-hidden">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6 min-w-0">
        <JobTrackingTimeline bookings={bookings} loading={loading} />
        <JobTrackingWorkerDetails bookings={bookings} loading={loading} />
        <JobTrackingServiceDetails bookings={bookings} loading={loading} />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-5 sticky top-6 w-full max-w-full">
        <JobTrackingNeedHelp bookings={bookings} />
      </div>
    </div>
  );
}