"use client";

import * as React from "react";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SwitchProps
  extends Omit<
    React.ComponentProps<typeof ShadcnSwitch>,
    "checked" | "defaultChecked" | "onCheckedChange"
  > {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: React.ReactNode;

  containerClassName?: string;
  labelClassName?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  containerClassName,
  labelClassName,
  className,
  ...props
}: SwitchProps) {
  return (
    <Label
      className={cn(
        "flex w-full items-center justify-between cursor-pointer",
        containerClassName
      )}
    >
      {label && (
        <span className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </span>
      )}

      <ShadcnSwitch
        checked={checked}
        onCheckedChange={(checked) => onChange(checked)}
        className={className}
        {...props}
      />
    </Label>
  );
}