import CommonProgress from "@/components/common/CommonProgress";
import { formatText } from "@/components/utils/formattext";

interface ActiveServiceHeaderProps {
  serviceName: string;
  status: string;
  progress: number;
  showTracking: boolean;
  isAssigned: boolean;
  isStarted: boolean;
}

export default function ActiveServiceHeader({
  serviceName,
  status,
  progress,
  showTracking,
  isAssigned,
  isStarted,
}: ActiveServiceHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        <span className="relative w-2.5 h-2.5 bg-green-500 rounded-full">
          <span className="absolute -inset-1 bg-green-500 rounded-full opacity-40 animate-pulse" />
        </span>

        <span className="font-semibold whitespace-normal sm:text-lg">
          {serviceName}
        </span>

        {showTracking && (
  <span
    className="
      px-2.5
      sm:px-3
      py-1
      text-[10px]
      sm:text-xs
      whitespace-nowrap
      bg-green-100
      text-green-700
      border
      rounded-full
      font-semibold
    "
  >
    {isAssigned
      ? "Assigned"
      : formatText(status)}
  </span>
         )}
      </div>

      {isStarted && (
        <div className="">
            <CommonProgress
            value={progress}
            showValue={true}
            
            
            />
        </div>
        )}
    </div>
  );
}