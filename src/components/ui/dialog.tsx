"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...props}
    />
  );
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      {...props}
    />
  );
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...props}
    />
  );
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        `
        fixed
        inset-0
        z-50
        bg-black/40
        backdrop-blur-sm

        data-open:animate-in
        data-open:fade-in-0

        data-closed:animate-out
        data-closed:fade-out-0
        `,
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          `
          fixed
          left-1/2
          top-1/2
          z-50

          flex
          flex-col

          w-[calc(100vw-1rem)]
          max-w-[95vw]

          sm:max-w-md
          md:max-w-lg
          lg:max-w-2xl
          xl:max-w-3xl

          max-h-[95dvh]

          -translate-x-1/2
          -translate-y-1/2

          overflow-hidden

          rounded-xl
          sm:rounded-2xl

          border
          bg-background
          shadow-2xl

          outline-none

          data-open:animate-in
          data-open:fade-in-0
          data-open:zoom-in-95

          data-closed:animate-out
          data-closed:fade-out-0
          data-closed:zoom-out-95
          `,
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="
                  absolute
                  right-2
                  top-2
                  h-8
                  w-8
                  rounded-full
                  sm:right-3
                  sm:top-3
                "
              />
            }
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        `
        shrink-0
        border-b

        px-4
        py-4

        sm:px-6
        sm:py-5

        flex
        flex-col
        gap-2
        `,
        className
      )}
      {...props}
    />
  );
}

function DialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        `
        flex-1
        overflow-y-auto

        px-4
        py-4

        sm:px-6
        sm:py-5
        `,
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        `
        shrink-0
        border-t
        bg-background

        p-4

        flex
        flex-col-reverse
        gap-3

        sm:flex-row
        sm:justify-end
        sm:gap-2
        `,
        className
      )}
      {...props}
    >
      {children}

      {showCloseButton && (
        <DialogPrimitive.Close
          render={<Button variant="outline" />}
        >
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        `
        text-lg
        font-semibold
        leading-tight
        tracking-tight

        sm:text-xl
        `,
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        `
        text-sm
        leading-6
        text-muted-foreground
        `,
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};