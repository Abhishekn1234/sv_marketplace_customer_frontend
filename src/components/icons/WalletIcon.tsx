interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function WalletIcon({
  className,
  size = 20,
  color = "currentColor",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
      <path d="M16 12h6v4h-6a2 2 0 1 1 0-4Z" />
    </svg>
  );
}