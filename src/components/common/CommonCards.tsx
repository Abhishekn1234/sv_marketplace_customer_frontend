import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

type CommandCardProps = {
  title?: string
  description?: string
  width?: string
  height?: string
  className?: string
  footer?: React.ReactNode
  children?: React.ReactNode
}

// Use forwardRef to attach ref to the root Card
export const CommandCard = React.forwardRef<HTMLDivElement, CommandCardProps>(
  ({ title, description, width = "w-full", height = "auto", className, footer, children }, ref) => {
    return (
      <Card
        ref={ref} // <-- attach ref here
        className={cn(width, height, "border rounded-xl bg-transparent", className)}
      >
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}

        <CardContent>{children}</CardContent>

        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    )
  }
)

CommandCard.displayName = "CommandCard"
