import React, { useRef } from 'react';

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange: (file: File) => void;
  children?: React.ReactNode; // For the trigger button
}

export function FileInput({ onFileChange, children, ...props }: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInternalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <input type="file" ref={fileInputRef} onChange={handleInternalFileChange} className="hidden" {...props} />
      {children && <div onClick={handleClick}>{children}</div>}
    </>
  );
}