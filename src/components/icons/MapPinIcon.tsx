import type { IconProps } from "./iconprops";


export function MapPinIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z"/>
      <circle cx="12" cy="11" r="2"/>
    </svg>
  );
}