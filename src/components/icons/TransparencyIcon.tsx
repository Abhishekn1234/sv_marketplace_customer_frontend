export default function TransparencyIcon() {
  return (
    <div className="w-14 h-14 bg-blue-50 rounded-[14px] flex items-center justify-center mb-5">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-7 h-7 text-blue-600"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    </div>
  );
}