import type { IconProps } from "./iconprops";


export function CalendarIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4"/>
      <path d="M8 2v4"/>
      <path d="M3 10h18"/>
    </svg>
  );
}