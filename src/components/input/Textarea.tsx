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
      ...props
    },
    ref
  ) => {
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
        <textarea
          ref={ref}
          id={id}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          className={cn(textareaClassName, className)}
          {...props}
        />
      </Field>
    );
  }
);

Textarea.displayName = "Textarea";
