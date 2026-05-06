import type { IconProps } from "./iconprops";

export const PhoneIcon = ({ size = 18, className = "" }: IconProps) => (
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
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 
      19.86 19.86 0 0 1-8.63-3.07 
      19.5 19.5 0 0 1-6-6 
      19.86 19.86 0 0 1-3.07-8.67 
      A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 
      c.12.81.37 1.6.72 2.34 
      a2 2 0 0 1-.45 2.11L8.09 9.91 
      a16 16 0 0 0 6 6l1.74-1.29 
      a2 2 0 0 1 2.11-.45 
      c.74.35 1.53.6 2.34.72 
      A2 2 0 0 1 22 16.92z" />
  </svg>
);