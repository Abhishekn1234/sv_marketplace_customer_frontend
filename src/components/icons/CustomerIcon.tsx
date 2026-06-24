export default function CustomerIcon() {
  return (
    <div className="w-14 h-14 bg-blue-50 rounded-[14px] flex items-center justify-center mb-5">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-7 h-7 text-blue-600"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );
}