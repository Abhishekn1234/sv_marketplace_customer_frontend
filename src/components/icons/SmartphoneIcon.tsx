import type { IconProps } from "./iconprops";


export function SmartphoneIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2"/>
      <path d="M12 18h.01"/>
    </svg>
  );
}