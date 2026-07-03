"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useLanguage } from "@/features/context/LanguageContext";
import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface CommonCardProps
  extends Omit<ComponentPropsWithoutRef<typeof Card>, "title"> {
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;

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
  className,
  contentClassName,
  onClick,
  type = "white",
  forceLTR = false,
  forceRTL = false,
  ...props
}: CommonCardProps) {
  const { isRTLOrder } = useLanguage();

  const isRTL = forceRTL ? true : forceLTR ? false : isRTLOrder;

  const typeStyles = {
    none: "border-0 shadow-none bg-transparent",
    orange: "bg-orange-50 border-orange-200",
    red: "bg-red-50 border-red-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    darkblue: "bg-blue-700 border-blue-800 text-white",
    white: "bg-white border-gray-200",
    soft: "bg-gray-50 border-gray-100",
    dark: "bg-gray-900 border-gray-800 text-white",
  };

  return (
    <Card
      {...props}
      dir={isRTL ? "rtl" : "ltr"}
      onClick={onClick}
      className={cn(
        "rounded-xl border shadow-sm transition-all duration-300",
        onClick &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        typeStyles[type],
        className
      )}
    >
      {title && (
        <CardHeader className={cn("pb-2", isRTL ? "text-right" : "text-left")}>
          <CardTitle
            className={cn(
              "text-sm font-semibold",
              type === "dark" || type === "darkblue"
                ? "text-white"
                : "text-gray-900"
            )}
          >
            {title}
          </CardTitle>
        </CardHeader>
      )}

      <CardContent
        className={cn(
          "p-6",
          isRTL ? "text-right" : "text-left",
          contentClassName
        )}
      >
        {children}
      </CardContent>

      {footer && (
        <CardFooter
          className={cn(
            "border-t pt-3",
            type === "dark" || type === "darkblue"
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