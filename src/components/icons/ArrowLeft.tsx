import type { IconProps } from "./iconprops";

export const ArrowLeftIcon = ({ size = 20, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-gray-700 ${className}`}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8l-4 4 4 4" />
    <path d="M16 12H8" />
  </svg>
);