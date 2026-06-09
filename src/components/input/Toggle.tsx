import Button from "./Button";

interface ToggleProps {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
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
    <Button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && setEnabled(!enabled)}
      className={`
        relative inline-flex h-6 w-11 items-center
        rounded-full transition-all duration-300 ease-in-out

        ${enabled ? "bg-blue-500" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}

        shadow-inner focus:outline-none
        ${className}
      `}
    >
      {/* Knob */}
      <span
        className={`
          absolute top-0.5 left-0.5
          h-5 w-5 rounded-full bg-white
          shadow-md transition-transform duration-300 ease-in-out

          ${enabled ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </Button>
  );
}