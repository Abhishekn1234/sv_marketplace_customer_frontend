import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type CommandCardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  width?: string;
  height?: string;
  className?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  icons?: React.ReactNode;
};

export const CommandCard = React.forwardRef<
  HTMLDivElement,
  CommandCardProps
>(
  (
    {
      title,
      description,
      width = "w-full",
      height = "auto",
      className,
      footer,
      children,
      icons,
      ...props // 👈 capture onClick, role, tabIndex, etc
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        {...props} // 👈 pass them to Card
        className={cn(
          width,
          height,
          "border rounded-xl bg-transparent",
          className
        )}
      >
        {(title || description || icons) && (
          <CardHeader className="flex items-center gap-3 text-center">
            {icons && <div className="mb-2">{icons}</div>}
            {title && <CardTitle>{title}</CardTitle>}
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </CardHeader>
        )}

        {children && <CardContent>{children}</CardContent>}
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    );
  }
);

CommandCard.displayName = "CommandCard";
