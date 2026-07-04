import * as React from "react";

interface IconProp extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export function ShieldCheckIcon({
  size = 24,
  color = "currentColor",
  className,
  ...props
}: IconProp) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}