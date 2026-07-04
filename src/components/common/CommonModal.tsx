"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/features/context/LanguageContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type CommonModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  width?: string;
  isRTLType?: boolean;
};

export default function CommonModal({
  open,
  onClose,
  title,
  children,
  footer,
  className = "",
  width = "sm:max-w-lg",
  isRTLType = false,
}: CommonModalProps) {
  const { isRTLOrder } = useLanguage();

  const isRTL = isRTLType || isRTLOrder;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className={`flex max-h-[85vh] flex-col gap-0 p-0 ${width} ${className}`}
      >
        {title && (
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle
              dir={isRTL ? "rtl" : "ltr"}
              className={isRTL ? "text-right" : "text-left"}
            >
              {title}
            </DialogTitle>
          </DialogHeader>
        )}

        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <DialogFooter className="border-t-0.5 px-4 ">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}