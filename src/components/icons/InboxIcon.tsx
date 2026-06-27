import type { SVGProps } from "react";

export const InboxIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 12h-5l-2 3H9l-2-3H2" />
      <path d="M5 12V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8" />
      <path d="M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
    </svg>
  );
};