import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary-500 text-white hover:bg-primary-600 border-transparent",
    secondary: "bg-surface-100 text-surface-900 hover:bg-surface-200 border-transparent",
    destructive: "bg-danger-500 text-white hover:bg-danger-600 border-transparent",
    success: "bg-success-500 text-white hover:bg-success-600 border-transparent",
    warning: "bg-warning-500 text-white hover:bg-warning-600 border-transparent",
    outline: "text-surface-950 border-surface-200",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
