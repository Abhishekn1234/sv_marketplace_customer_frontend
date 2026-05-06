"use client";

import { useEffect, type ReactNode } from "react";

type CommonModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string; // e.g. "max-w-md", "max-w-2xl"
};

export default function CommonModal({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-lg",
}: CommonModalProps) {
  
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${width} mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        {title && (
          <div className="px-5 py-4  font-semibold text-lg flex justify-between items-center">
            {title}
            <button onClick={onClose} className="text-gray-500 hover:text-black">
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4  flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}