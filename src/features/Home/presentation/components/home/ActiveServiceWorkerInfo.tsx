import { VerifiedTickIcon } from "@/components/icons";
import { Image } from "@/components/input";

interface ActiveServiceWorkerInfoProps {
  workerName: string;
  workerImage: string;
  hasWorker: boolean;
  assignedText?: string;
  waitingText?: string;
}

export default function ActiveServiceWorkerInfo({
  workerName,
  workerImage,
  hasWorker,
  assignedText = "Assigned Professional",
  waitingText = "Waiting for worker",
}: ActiveServiceWorkerInfoProps) {
  return (
    <div className="flex items-center gap-3 mb-5 min-w-0">
      <Image
        src={workerImage}
        alt={workerName}
        className="h-12 w-12 shrink-0 rounded-lg border object-cover sm:h-14 sm:w-14"
      />
      <div className="min-w-0 flex-1">
  <div className="flex items-center gap-2">
    <span className="truncate font-semibold">
      {workerName}
    </span>

    {hasWorker && (
      <VerifiedTickIcon
        bgColor="#2563EB"
        size={18}
        className="shrink-0"
      />
    )}
  </div>

  <div className="truncate text-xs text-gray-400 sm:text-sm">
    {hasWorker ? assignedText : waitingText}
  </div>
</div>
    </div>
  );
}