"use client";

interface CommonSpinnerProps {
  size?: number; // px
  className?: string;
}

export default function CommonSpinner({
  size = 20,
  className = "",
}: CommonSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}