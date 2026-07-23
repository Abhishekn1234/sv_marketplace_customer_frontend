import type { SVGProps } from "react";

export default function ReviewIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 11H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 8H13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 14H12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 12C20 16.4183 16.4183 20 12 20H8L4 22V18C2.76393 16.6156 2 14.7928 2 12C2 7.58172 5.58172 4 10 4H12C16.4183 4 20 7.58172 20 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 6.5L18.1 7.72L19.5 7.92L18.5 8.9L18.74 10.3L17.5 9.65L16.26 10.3L16.5 8.9L15.5 7.92L16.9 7.72L17.5 6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}