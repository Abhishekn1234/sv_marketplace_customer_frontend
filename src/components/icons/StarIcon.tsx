export function StarIcon({
  active = false,
  className = "",
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-4 h-4 transition-colors ${
        active
          ? "fill-yellow-500 text-yellow-500"
          : "fill-gray-300 text-gray-300"
      } ${className}`}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}