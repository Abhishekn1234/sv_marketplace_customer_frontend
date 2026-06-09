"use client";

import type { ReactNode } from "react";

interface CommonCardProps {
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;

  // NEW: card type system
  type?: "none" | "white" | "soft" | "dark" |"blue" |"green"|"red" |"orange";
}

export default function CommonCard({
  children,
  title,
  footer,
  className = "",
  onClick,
  type = "white",
}: CommonCardProps) {
  const typeStyles = {
    none: "bg-transparent border-0 shadow-none",
    orange:"bg-orange-50 border border-orange-200 shadow-sm",
    red:"bg-red-50 border border-red-200 shadow-sm",
    green:"bg-green-50 border border-green-200 shadow-sm",
    blue:"bg-blue-50 border border-blue-200 shadow-sm",
    white: "bg-white border border-gray-200 shadow-sm",
    soft: "bg-gray-50 border border-gray-100 shadow-sm",
    dark: "bg-gray-900 text-white border border-gray-800 shadow-md",
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl
        p-4 sm:p-5
        transition

        ${typeStyles[type]}

        ${onClick ? "cursor-pointer hover:shadow-md" : ""}

        ${className}
      `}
    >
      {/* Header */}
      {title && (
        <div
          className={`mb-3 text-sm font-semibold ${
            type === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </div>
      )}

      {/* Body */}
      <div>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          className={`mt-4 pt-3 border-t ${
            type === "dark" ? "border-gray-700" : "border-gray-100"
          }`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}