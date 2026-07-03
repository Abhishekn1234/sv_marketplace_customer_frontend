import { Input } from "@/components/ui/input";

interface AddressInputProps
  extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function AddressInput({
  value,
  onChange,
  className,
  ...rest
}: AddressInputProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full
        mb-2
        pl-3
        pr-3
        py-2
        border-2
        border-gray-200
        rounded-xl
        focus:outline-none
        focus:border-blue-500
        text-sm
        ${className ?? ""}
      `}
      {...rest}
    />
  );
}