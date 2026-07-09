export const BadgeCheckIcon = ({
  className = "w-6 h-6",
}: {
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3l2.09 1.26 2.44-.52.98 2.29 2.29.98-.52 2.44L21 12l-1.26 2.09.52 2.44-2.29.98-.98 2.29-2.44-.52L12 21l-2.09-1.26-2.44.52-.98-2.29-2.29-.98.52-2.44L3 12l1.26-2.09-.52-2.44 2.29-.98.98-2.29 2.44.52L12 3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);