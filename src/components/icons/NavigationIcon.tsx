interface SendIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const NavigationGPSIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}: SendIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      className={className}
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
};