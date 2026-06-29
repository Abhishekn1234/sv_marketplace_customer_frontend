import type { IconProps } from "./iconprops";


export function CreditCardIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M2 10h20"/>
    </svg>
  );
}