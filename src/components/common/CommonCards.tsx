"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/features/context/LanguageContext";

interface CommonCardProps {
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;

  type?: "none" | "white" | "soft" | "dark" | "blue" | "green" | "red" | "orange";

  // NEW: RTL control (optional override)
  forceLTR?: boolean;
  forceRTL?: boolean;
}

export default function CommonCard({
  children,
  title,
  footer,
  className = "",
  onClick,
  type = "white",
  forceLTR = false,
  forceRTL = false,
}: CommonCardProps) {
  const { isRTLOrder } = useLanguage();

  const isRTL = forceRTL ? true : forceLTR ? false : isRTLOrder;

  const typeStyles = {
    none: "bg-transparent border-0 shadow-none",
    orange: "bg-orange-50 border border-orange-200 shadow-sm",
    red: "bg-red-50 border border-red-200 shadow-sm",
    green: "bg-green-50 border border-green-200 shadow-sm",
    blue: "bg-blue-50 border border-blue-200 shadow-sm",
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
        text-start

        ${typeStyles[type]}

        ${onClick ? "cursor-pointer hover:shadow-md" : ""}

        ${className}
      `}
    >
      {/* HEADER */}
      {title && (
        <div
          className={`mb-3 text-sm font-semibold ${
            type === "dark" ? "text-white" : "text-gray-800"
          } ${isRTL ? "rtl" : ""}`}
        >
          {title}
        </div>
      )}

      {/* BODY */}
      <div className={`${isRTL ? "rtl" : ""}`}>
        {children}
      </div>

      {/* FOOTER */}
      {footer && (
        <div
          className={`mt-4 pt-3 border-t ${
            type === "dark" ? "border-gray-700" : "border-gray-100"
          } ${isRTL ? "text-right" : "text-left"}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
}