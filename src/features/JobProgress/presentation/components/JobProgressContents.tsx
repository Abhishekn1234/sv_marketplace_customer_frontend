import { JobProgressCard } from "./JobProgressCard";
import { JobProgressInfo } from "./JobProgressInfo";
import { JobProgressProgress } from "./JobProgressProgress";
import ProviderWorkingCard from "./JobProgressProviderWorkerCard";

export default function JobProgressContents() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6">
        <JobProgressProgress />
        <JobProgressCard />
        <ProviderWorkingCard />
      </div>

      {/* Right Column */}
      <JobProgressInfo />
    </div>
  );
}
