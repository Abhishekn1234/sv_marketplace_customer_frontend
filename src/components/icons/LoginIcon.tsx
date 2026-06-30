export const LoginIcon = ({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Door */}
    <path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" />

    {/* Arrow */}
    <path d="M10 12h11" />
    <path d="m18 8 4 4-4 4" />
  </svg>
);