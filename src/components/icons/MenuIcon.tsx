import type { IconProps } from "./iconprops";


export function MenuIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 6h16"/>
      <path d="M4 12h16"/>
      <path d="M4 18h16"/>
    </svg>
  );
}