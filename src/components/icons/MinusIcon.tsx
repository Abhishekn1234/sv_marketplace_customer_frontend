import * as React from "react";

interface IconProp extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const MinusIcon = ({
  size = 20,
  color = "currentColor",
  className,
  ...props
}: IconProp) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};