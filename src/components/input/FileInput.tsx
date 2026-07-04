import React, { useId } from "react";

interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  onFileChange: (file: File) => void;
  children: React.ReactNode;
}

export function FileInput({
  onFileChange,
  children,
  ...props
}: FileInputProps) {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onFileChange(file);

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        id={id}
        type="file"
        hidden
        onChange={handleChange}
        {...props}
      />

      <label htmlFor={id} className="cursor-pointer">
        {children}
      </label>
    </>
  );
} 