import type { FC } from "react";

interface TickIconProps {
  color?: string;
  className?: string;
}

export const TickIcon: FC<TickIconProps> = ({
  color = "text-amber-500",
  className = "h-5 w-5",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} ${color}`}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);