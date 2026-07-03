import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface RadioProps
  extends Omit<
    React.ComponentProps<typeof RadioGroupItem>,
    "children"
  > {
  label?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Radio({
  label,
  containerClassName,
  labelClassName,
  leftIcon,
  rightIcon,
  className,
  ...props
}: RadioProps) {
  return (
    <Label
      className={cn(
        "flex items-center gap-2 cursor-pointer",
        containerClassName
      )}
    >
      {leftIcon}

      <RadioGroupItem
        className={className}
        {...props}
      />

      {label && (
        <span
          className={cn(
            "text-sm text-gray-900",
            labelClassName
          )}
        >
          {label}
        </span>
      )}

      {rightIcon && (
        <span className="ml-auto">
          {rightIcon}
        </span>
      )}
    </Label>
  );
}