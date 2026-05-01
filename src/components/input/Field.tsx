import * as React from "react";
import { cn } from "@/lib/utils";
import {
  fieldErrorClassName,
  fieldHintClassName,
  fieldLabelClassName,
} from "./inputStyles";

export interface FieldProps {
  id?: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

export function Field({
  id,
  label,
  helperText,
  error,
  required,
  containerClassName,
  labelClassName,
  children,
}: FieldProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className={cn(fieldLabelClassName, labelClassName)}>
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <p className={fieldErrorClassName}>{error}</p>
      ) : helperText ? (
        <p className={fieldHintClassName}>{helperText}</p>
      ) : null}
    </div>
  );
}
