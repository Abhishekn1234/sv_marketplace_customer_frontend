
import JobTrackingTimeline from "./JobTrackingTimeline";
import JobTrackingWorkerDetails from "./JobTrackingWorkerDetails";
import JobTrackingServiceDetails from "./JobTrackingServiceDetails";
// import JobTrackingLocation from "./JobTrackingLocation";
import JobTrackingNeedHelp from "./JobTrackingNeedHelp";

export default function JobTrackingLayout() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 overflow-x-hidden">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6 min-w-0">
        <JobTrackingTimeline />
        <JobTrackingWorkerDetails />
        <JobTrackingServiceDetails />
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-5 sticky top-6 w-full max-w-full">
        <JobTrackingNeedHelp />
      </div>
    </div>
  );
}
