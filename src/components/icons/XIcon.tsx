import type { IconProps } from "./iconprops";


export function XIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6 6 18"/>
      <path d="M6 6l12 12"/>
    </svg>
  );
}