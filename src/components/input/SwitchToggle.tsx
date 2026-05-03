

interface SwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <label className="flex items-center justify-between w-full cursor-pointer">
      {label && <span className="text-sm">{label}</span>}

      <div
        onClick={() => onChange(!checked)}
        className={`
          w-11 h-6 flex items-center rounded-full p-1 transition
          ${checked ? "bg-blue-600" : "bg-gray-300"}
        `}
      >
        <div
          className={`
            w-4 h-4 bg-white rounded-full shadow transform transition
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </div>
    </label>
  );
}