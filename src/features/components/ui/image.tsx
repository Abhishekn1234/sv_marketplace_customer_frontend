import * as React from "react";
import { cn } from "./utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  fallbackSrc?: string; // optional fallback image if src fails
  rounded?: boolean; // optional rounded corners
  shadow?: boolean; // optional shadow
  size?: "sm" | "md" | "lg"; // optional size variants
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      className,
      fallbackSrc = "https://via.placeholder.com/150", // default placeholder
      rounded = true,
      shadow = false,
      size = "md",
      onError,
      ...props
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = React.useState(props.src || fallbackSrc);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setImgSrc(fallbackSrc);
      if (onError) onError(e);
    };

    // Size classes
    const sizeClass = {
      sm: "h-16 w-16",
      md: "h-32 w-32",
      lg: "h-48 w-48",
    }[size];

    return (
      <img
        ref={ref}
        {...props}
        src={imgSrc}
        onError={handleError}
        className={cn(
          "object-cover",
          rounded && "rounded-lg",
          shadow && "shadow-md",
          sizeClass,
          className
        )}
      />
    );
  }
);

Image.displayName = "Image";

export { Image };
