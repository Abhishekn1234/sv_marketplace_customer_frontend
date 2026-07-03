"use client";

import * as React from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Field } from "./Field";

export interface TextareaProps
  extends React.ComponentProps<typeof ShadcnTextarea> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;

  autoResize?: boolean;
  maxHeight?: number;

  rightElement?: React.ReactNode;
  inputWrapperClassName?: string;
  rightElementClassName?: string;
}

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      id,
      label,
      helperText,
      error,
      required,
      containerClassName,
      labelClassName,
      className,

      autoResize = false,
      maxHeight = 120,

      rightElement,
      inputWrapperClassName,
      rightElementClassName,

      onChange,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => innerRef.current!);

    const handleChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      if (autoResize && innerRef.current) {
        const el = innerRef.current;

        el.style.height = "auto";
        el.style.height = `${Math.min(
          el.scrollHeight,
          maxHeight
        )}px`;
      }

      onChange?.(e);
    };

    return (
      <Field
        id={id}
        label={label}
        helperText={helperText}
        error={error}
        required={required}
        containerClassName={containerClassName}
        labelClassName={labelClassName}
      >
        <div
          className={cn(
            "relative w-full",
            inputWrapperClassName
          )}
        >
          <ShadcnTextarea
            ref={innerRef}
            id={id}
            required={required}
            rows={1}
            aria-invalid={!!error}
            onChange={handleChange}
            className={cn(
              autoResize &&
                "resize-none overflow-y-auto min-h-[40px]",
              rightElement && "pr-12",
              className
            )}
            {...props}
          />

          {rightElement && (
            <div
              className={cn(
                "absolute right-3 bottom-3 flex items-center",
                rightElementClassName
              )}
            >
              {rightElement}
            </div>
          )}
        </div>
      </Field>
    );
  }
);

Textarea.displayName = "Textarea";