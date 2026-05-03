import React, { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  wrapperClassName?: string;
}

export function Image({
  src,
  alt = "image",
  className = "",
  wrapperClassName = "",
  fallback,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${wrapperClassName}`}
      >
        {fallback ?? (
          <span className="text-xs text-gray-400">No Image</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
}