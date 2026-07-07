"use client";

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
} from "../ui/progress";

interface CommonProgressProps {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}

export default function CommonProgress({
  value,
  label,
  showValue = true,
  className,
  trackClassName,
  indicatorClassName,
}: CommonProgressProps) {
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {value}%
            </span>
          )}
        </div>
      )}

      <Progress value={value}>
        <ProgressTrack className={trackClassName}>
          <ProgressIndicator className={indicatorClassName} />
        </ProgressTrack>
      </Progress>
    </div>
  );
}