"use client";

import { useEffect, type ReactNode } from "react";
import Button from "../input/Button";
import { useLanguage } from "@/features/context/LanguageContext";

type CommonModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  width?: string;
  isRTLType?: boolean; // Controls title alignment only
};

export default function CommonModal({
  open,
  onClose,
  title,
  children,
  className = "",
  footer,
  width = "max-w-lg",
  isRTLType = false,
}: CommonModalProps) {
  const { isRTLOrder } = useLanguage();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal Wrapper */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`
            relative
            bg-white
            rounded-2xl
            shadow-xl
            w-full
            ${width}
            max-h-[90vh]
            flex
            flex-col
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="px-5 py-4 flex items-center justify-between border-0">
              <span
                dir={isRTLType ? "rtl" : isRTLOrder ? "rtl" : "ltr"}
                className={`flex-1 text-lg font-semibold ${
                  isRTLType
                    ? "text-right"
                    : isRTLOrder
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {title}
              </span>

              <Button
                onClick={onClose}
                className="text-gray-500 hover:text-black ml-2"
              >
                ✕
              </Button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-5 py-4 border-0 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}