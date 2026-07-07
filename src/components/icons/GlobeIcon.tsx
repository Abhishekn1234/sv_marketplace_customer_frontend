export const GlobeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.5 15.5 0 0 1 4 10 15.5 15.5 0 0 1-4 10 15.5 15.5 0 0 1-4-10 15.5 15.5 0 0 1 4-10Z" />
  </svg>
);