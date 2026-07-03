"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/features/context/LanguageContext";
import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface CommonCardProps {
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;

  type?:
    | "none"
    | "darkblue"
    | "white"
    | "soft"
    | "dark"
    | "blue"
    | "green"
    | "red"
    | "orange";

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
    none: "border-0 shadow-none bg-transparent",
    orange: "bg-orange-50 border-orange-200",
    red: "bg-red-50 border-red-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    darkblue: "bg-blue-700 text-white border-blue-800",
    white: "bg-white border-gray-200",
    soft: "bg-gray-50 border-gray-100",
    dark: "bg-gray-900 text-white border-gray-800",
  };

  return (
    <Card
      onClick={onClick}
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "transition",
        "rounded-xl shadow-sm",
        onClick && "cursor-pointer hover:shadow-md",
        typeStyles[type],
        className
      )}
    >
      {/* HEADER */}
      {title && (
        <CardHeader className={cn("pb-2", isRTL ? "text-right" : "text-left")}>
          <CardTitle
            className={cn(
              type === "dark" || type === "darkblue"
                ? "text-white"
                : "text-gray-800",
              "text-sm font-semibold"
            )}
          >
            {title}
          </CardTitle>
        </CardHeader>
      )}

      {/* CONTENT */}
      <CardContent className={cn(isRTL ? "text-right" : "text-left")}>
        {children}
      </CardContent>

      {/* FOOTER */}
      {footer && (
        <CardFooter
          className={cn(
            "border-t pt-3",
            type === "dark"
              ? "border-gray-700"
              : "border-gray-100",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}