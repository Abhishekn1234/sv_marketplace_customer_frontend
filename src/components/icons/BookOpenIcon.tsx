import type { IconProps } from "./iconprops";


export function BookOpenIcon(props: IconProps) {
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
      <path d="M12 7v14" />
      <path d="M3 18a2 2 0 0 1 2-2h7v5H5a2 2 0 0 1-2-2z" />
      <path d="M21 18a2 2 0 0 0-2-2h-7v5h7a2 2 0 0 0 2-2z" />
      <path d="M5 3h7v13H5a2 2 0 0 0-2 2V5a2 2 0 0 1 2-2z" />
      <path d="M19 3h-7v13h7a2 2 0 0 1 2 2V5a2 2 0 0 0-2-2z" />
    </svg>
  );
}