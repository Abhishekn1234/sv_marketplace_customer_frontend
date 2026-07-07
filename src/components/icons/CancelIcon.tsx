import type { FC } from "react";

interface CancelIconProps {
  color?: string;
  bgColor?: string;
  size?: number;
}

export const CancelIcon: FC<CancelIconProps> = ({
  color = "text-white",
  bgColor = "bg-red-500",
  size = 18,
}) => (
  <div
    className={`inline-flex items-center justify-center rounded-full ${bgColor}`}
    style={{
      width: size + 10,
      height: size + 10,
    }}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className={color}
      style={{
        width: size,
        height: size,
      }}
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);