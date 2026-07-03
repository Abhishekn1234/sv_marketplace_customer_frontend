import * as React from "react";
import { cn } from "@/lib/utils";

export interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  wrapperClassName?: string;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt = "image",
      className,
      wrapperClassName,
      fallback,
      onError,
      ...props
    },
    ref
  ) => {
    const [error, setError] = React.useState(false);

    if (!src || error) {
      return (
        <div
          className={cn(
            "flex items-center justify-center bg-gray-100",
            wrapperClassName
          )}
        >
          {fallback ?? (
            <span className="text-xs text-gray-400">
              No Image
            </span>
          )}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(className)}
        onError={(e) => {
          setError(true);
          onError?.(e);
        }}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";