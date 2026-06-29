import type { SVGProps } from "react";

export function BellRing(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.27 21a2 2 0 0 0 3.46 0" />
      <path d="M18.63 13A17.89 17.89 0 0 1 18 8a6 6 0 0 0-12 0c0 2.09-.38 4.1-1.11 5.93" />
      <path d="M2 8c0-2.2.7-4.3 2-6" />
      <path d="M22 8c0-2.2-.7-4.3-2-6" />
      <path d="M4.27 15A2 2 0 0 0 6 18h12a2 2 0 0 0 1.73-3" />
    </svg>
  );
}