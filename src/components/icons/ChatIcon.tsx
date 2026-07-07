import type { FC } from "react";

interface ChatIconProps {
  color?: string;
  bgColor?: string;
  size?: number;
}

export const ChatIcon: FC<ChatIconProps> = ({
  color = "text-white",
  bgColor = "bg-green-500",
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
        d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.2-3.2A7.6 7.6 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  </div>
);