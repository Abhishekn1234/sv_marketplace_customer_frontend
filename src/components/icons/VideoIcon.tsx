import type { IconProps } from "./iconprops";

export const VideoIcon = ({ size = 18, className = "" }: IconProps) => (
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
    <rect x="2" y="7" width="15" height="10" rx="2" />
    <polygon points="17 7 22 12 17 17" />
  </svg>
);
