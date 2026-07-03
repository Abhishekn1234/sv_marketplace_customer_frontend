import React, { forwardRef } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/input/PhoneInput";

type Size = "sm" | "md" | "lg" | "xl";
type Radius = "sm" | "md" | "lg" | "xl" | "full";
type Variant = "default" | "unstyled";

interface InputProps
  extends Omit<
    React.ComponentProps<typeof ShadcnInput>,
    "size" | "type" | "onChange"
  > {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;

  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;

  variant?: Variant;
  size?: Size;
  radius?: Radius;

  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];

  value?: string;
  onChange?: (value: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      containerClassName,
      labelClassName,
      className,
      rightElement,
      leftElement,
      variant = "default",
      size = "md",
      radius = "lg",
      type = "text",
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const isPhone = type === "tel";

    return (
      <div className={containerClassName}>
        {label && (
          <Label
            className={cn(
              "block text-sm font-semibold mb-2",
              labelClassName
            )}
          >
            {label}
          </Label>
        )}

        {isPhone ? (
          <PhoneInput
            value={value || ""}
            onChange={(val) => onChange?.(val)}
          />
        ) : (
          <div className="relative">
            <ShadcnInput
              ref={ref}
              type={type}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className={cn(
                "w-full outline-none transition text-gray-900",

                variant === "default"
                  ? "border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  : "bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",

                size === "sm" && "px-3 py-1.5 text-sm",
                size === "md" && "px-4 py-2 text-sm",
                size === "lg" && "px-4 py-2.5 text-base",
                size === "xl" && "px-5 py-3 text-lg",

                radius === "sm" && "rounded-md",
                radius === "md" && "rounded-lg",
                radius === "lg" && "rounded-xl",
                radius === "xl" && "rounded-2xl",
                radius === "full" && "rounded-full",

                leftElement && "pl-10",
                rightElement && "pr-10",

                className
              )}
              {...props}
            />

            {leftElement && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                {leftElement}
              </div>
            )}

            {rightElement && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                {rightElement}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";