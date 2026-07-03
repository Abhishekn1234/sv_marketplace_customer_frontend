import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AppProgressProps {
  value: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}

export default function AppProgress({
  value,
  label = "Progress",
  showLabel = false,
  className,
  trackClassName,
  indicatorClassName,
}: AppProgressProps) {
  return (
    <Progress
      value={value}
      className={cn("w-full", className)}
    >
      {showLabel && (
        <>
          <ProgressLabel>{label}</ProgressLabel>
          <ProgressValue />
        </>
      )}

      <ProgressTrack
        className={cn("h-2 rounded-full", trackClassName)}
      >
        <ProgressIndicator
          className={cn(
            "rounded-full bg-primary transition-all duration-300",
            indicatorClassName
          )}
        />
      </ProgressTrack>
    </Progress>
  );
}