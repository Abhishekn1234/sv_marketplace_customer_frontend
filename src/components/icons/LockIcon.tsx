type LockIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function LockIcon({
  size = 22,
  color = "#16A34A",
  className = "",
}: LockIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      width={size}
      height={size}
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}