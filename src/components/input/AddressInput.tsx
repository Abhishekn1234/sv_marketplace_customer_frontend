

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AddressInput({ value, onChange, ...rest }: AddressInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-3 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
      {...rest}
    />
  );
}