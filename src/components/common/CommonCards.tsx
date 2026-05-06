"use client";

import type { ReactNode } from "react";

interface CommonCardProps {
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function CommonCard({
  children,
  title,
  footer,
  className = "",
  onClick,
}: CommonCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-gray-200 rounded-xl shadow-sm
        p-4 sm:p-5
        ${onClick ? "cursor-pointer hover:shadow-md transition" : ""}
        ${className}
      `}
    >
      {/* Header */}
      {title && (
        <div className="mb-3 text-sm font-semibold text-gray-800">
          {title}
        </div>
      )}

      {/* Body */}
      <div>{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}