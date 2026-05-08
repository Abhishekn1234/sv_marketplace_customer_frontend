"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Field } from "./Field";
import { textareaClassName } from "./inputStyles";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => innerRef.current!);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize && innerRef.current) {
        const el = innerRef.current;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
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
              "relative flex w-full items-end px-3 py-1 transition-all duration-150",
              inputWrapperClassName
            )}
          >
          <textarea
            ref={innerRef}
            id={id}
            required={required}
            rows={1}
            aria-invalid={Boolean(error) || undefined}
            onChange={handleChange}
            className={cn(
              "flex-1 resize-none bg-transparent outline-none",
              "text-sm sm:text-base leading-5",
              "min-h-[36px] max-h-[120px]",
              "overflow-y-auto",
              "placeholder:text-gray-400",
              "pr-12", // space for send button
              textareaClassName,
              className
            )}
            {...props}
          />

          {rightElement && (
            <div className={cn("absolute bottom-2 right-5 flex items-center", rightElementClassName)}>
              {rightElement}
            </div>
          )}
        </div>
      </Field>
    );
  }
);

Textarea.displayName = "Textarea";
