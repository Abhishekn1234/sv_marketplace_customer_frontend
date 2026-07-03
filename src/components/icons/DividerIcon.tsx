import { cn } from "@/lib/utils";

interface DividerIconProps {
  className?: string;
}

export default function DividerIcon({
  className,
}: DividerIconProps) {
  return (
    <div
      className={cn(
        "hidden sm:block h-4 w-px bg-gray-200",
        className
      )}
    />
  );
}