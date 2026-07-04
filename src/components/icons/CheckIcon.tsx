import { cn } from "@/lib/utils"; // optional if you're using shadcn's cn()

interface CheckIconProps {
  included?: boolean;
  className?: string;
  size?: number;
}

export function CheckIcon({
  included = true,
  className,
  size = 20,
}: CheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={included ? "#ffffff" : "#9CA3AF"}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
    >
      {included ? (
        <polyline points="20 6 9 17 4 12" />
      ) : (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      )}
    </svg>
  );
}