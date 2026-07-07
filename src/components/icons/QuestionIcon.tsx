import type { FC } from "react";

interface QuestionIconProps {
  color?: string;
  bgColor?: string;
  size?: number;
}

export const QuestionIcon: FC<QuestionIconProps> = ({
  color = "text-white",
  bgColor = "bg-blue-500",
  size = 18,
}) => (
  <div
    className={`inline-flex items-center justify-center rounded-full ${bgColor}`}
    style={{
      width: size + 10,
      height: size + 10,
    }}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={color}
      style={{ width: size, height: size }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.09 9a3 3 0 115.82 1c0 2-3 3-3 3m0 4h.01"
      />
    </svg>
  </div>
);