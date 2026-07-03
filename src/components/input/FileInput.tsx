import React, { useRef } from "react";
import { Input } from "@/components/ui/input";

interface FileInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    "type" | "onChange"
  > {
  onFileChange: (file: File) => void;
  children?: React.ReactNode;
}

export function FileInput({
  onFileChange,
  children,
  ...props
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInternalFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleInternalFileChange}
        {...props}
      />

      {children && (
        <div
          onClick={handleClick}
          className="cursor-pointer"
        >
          {children}
        </div>
      )}
    </>
  );
}