import { cn } from "@/lib/utils";
import { Switch } from "./SwitchToggle";


interface ToggleProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function Toggle({
  enabled,
  setEnabled,
  className,
  disabled = false,
}: ToggleProps) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      disabled={disabled}
      className={cn(className)}
    />
  );
}