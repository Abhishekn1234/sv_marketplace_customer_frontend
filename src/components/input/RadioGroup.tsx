import * as React from "react";
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps
  extends Omit<
    React.ComponentProps<typeof ShadcnRadioGroup>,
    "value" | "onValueChange" | "onChange"
  > {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (val: string) => void;
}
export function RadioGroup({
  name,
  options,
  value,
  onChange,
  className,
  ...props
}: RadioGroupProps) {
  return (
    <ShadcnRadioGroup
      value={value}
      onValueChange={onChange}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {options.map((opt) => (
        <div
          key={opt.value}
          className="flex items-center gap-2"
        >
          <RadioGroupItem
            id={`${name}-${opt.value}`}
            value={opt.value}
          />

          <Label
            htmlFor={`${name}-${opt.value}`}
            className="cursor-pointer text-sm font-normal"
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </ShadcnRadioGroup>
  );
}