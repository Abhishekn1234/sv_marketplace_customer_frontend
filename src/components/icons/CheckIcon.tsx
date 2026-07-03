interface CheckIconProps {
  included?: boolean;
}

export function CheckIcon({ included }: CheckIconProps) {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 24 24"
      fill="none"
      stroke={included ? "#ffffff" : "#9CA3AF"}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {included ? (
        <polyline points="20 6 9 17 4 12" />
      ) : (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      )}
    </svg>
  );
}