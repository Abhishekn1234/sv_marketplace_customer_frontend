
import JobTrackingTimeline from "./JobTrackingTimeline";
import JobTrackingWorkerDetails from "./JobTrackingWorkerDetails";
import JobTrackingServiceDetails from "./JobTrackingServiceDetails";
import JobTrackingLocation from "./JobTrackingLocation";
import JobTrackingNeedHelp from "./JobTrackingNeedHelp";

export default function JobTrackingLayout() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-8">
      {/* Left Column */}
      <div className="flex flex-col gap-6">
        <JobTrackingTimeline />
        <JobTrackingWorkerDetails />
        <JobTrackingServiceDetails />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-5 sticky top-6">
        <JobTrackingLocation />
        <JobTrackingNeedHelp />
      </div>
    </div>
  );
}
