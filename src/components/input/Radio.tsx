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
  id,
  label,
  containerClassName,
  labelClassName,
  leftIcon,
  rightIcon,
  className,
  ...props
}: RadioProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        containerClassName
      )}
    >
      {leftIcon}

      <RadioGroupItem
        id={id}
        className={className}
        {...props}
      />

      {label && (
        <Label
          htmlFor={id}
          className={cn(
            "cursor-pointer text-sm text-gray-900",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}

      {rightIcon && <span className="ml-auto">{rightIcon}</span>}
    </div>
  );
}