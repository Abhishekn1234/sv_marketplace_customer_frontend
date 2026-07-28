import React from "react";

interface VerifiedTickIconProps {
  size?: number;
  bgColor?: string;
  tickColor?: string;
  borderColor?: string;
  className?: string;
}

export default function VerifiedTickIcon({
  size = 32,
  bgColor = "#0EA5E9",
  tickColor = "#FFFFFF",
  borderColor = "#BFDBFE",
  className,
}: VerifiedTickIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <circle cx={16} cy={16} r={15} fill={bgColor} />

      <circle
        cx={16}
        cy={16}
        r={14}
        stroke={borderColor}
        strokeWidth={2}
      />

      <path
        d="M10.5 16L14.2 19.7L21.8 12.3"
        stroke={tickColor}
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}