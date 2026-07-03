import React, { forwardRef } from "react";
import PhoneInputLib, { type PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/"; 

/* ---------------- TYPES ---------------- */

type Size = "sm" | "md" | "lg" | "xl";
type Radius = "sm" | "md" | "lg" | "xl" | "full";
type Variant = "default" | "unstyled";

interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type"
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
}

/* ---------------- STYLES ---------------- */

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-2.5 text-base",
  xl: "px-5 py-3 text-lg",
};

const radiusStyles: Record<Radius, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
};

const variantStyles: Record<Variant, string> = {
  default: "border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
  unstyled: "bg-gray-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
};

/* ---------------- PHONE WRAPPER ---------------- */

const PhoneInput = forwardRef<
  HTMLInputElement,
  PhoneInputProps & { className?: string }
>((props, ref) => {
  const Component = PhoneInputLib as unknown as React.ComponentType<
    PhoneInputProps & { inputRef?: React.Ref<HTMLInputElement> }
  >;

  return <Component {...props} inputRef={ref} />;
});

PhoneInput.displayName = "PhoneInput";

/* ---------------- INPUT COMPONENT ---------------- */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      containerClassName,
      labelClassName,
      className = "",
      rightElement,
      leftElement,
      variant = "default",
      size = "md",
      radius = "lg",
      type = "text",
      ...props
    },
    ref
  ) => {
    const isPhone = type === "tel";

    return (
      <div className={containerClassName}>
        {/* LABEL */}
        {label && (
          <label className={`block text-sm font-semibold mb-2 ${labelClassName}`}>
            {label}
          </label>
        )}

        <div className="relative">
          {/* ---------------- PHONE INPUT ---------------- */}
          {isPhone ? (
            <PhoneInput
              country="in"
              {...(props as any)}
              inputProps={{
                ref,
                className: `
                  w-full outline-none transition text-gray-900
                  ${variantStyles[variant]}
                  ${sizeStyles[size]}
                  ${radiusStyles[radius]}
                  ${className}
                `,
              }}
              // Note: react-phone-input-2 injects its own wrapper styles. 
              // To make it layout correctly, you often need to unstyle its container:
              containerStyle={{ width: "100%" }}
            />
          ) : (
            /* ---------------- NORMAL INPUT ---------------- */
            <input
              ref={ref}
              type={type}
              className={`
                w-full outline-none transition text-gray-900
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${radiusStyles[radius]}
                ${rightElement ? "pr-12" : ""}
                ${leftElement ? "pl-10" : ""}
                ${className}
              `}
              {...props}
            />
          )}

          {/* LEFT ELEMENT */}
          {!isPhone && leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {leftElement}
            </div>
          )}

          {/* RIGHT ELEMENT */}
          {!isPhone && rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";