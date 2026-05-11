import * as React from "react"
import { cn } from "../../lib/utils"
import { LucideIcon } from "lucide-react"

export interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  variant?: "primary" | "warning" | "danger" | "success" | "surface"
  size?: number
}

const IconBox = React.forwardRef<HTMLDivElement, IconBoxProps>(
  ({ className, icon: Icon, variant = "primary", size = 20, ...props }, ref) => {
    const variants = {
      primary: "text-primary-600",
      warning: "text-warning-600",
      danger: "text-danger-600",
      success: "text-success-600",
      surface: "text-surface-600",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "p-2 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200",
          variants[variant],
          className
        )}
        {...props}
      >
        <Icon size={size} />
      </div>
    )
  }
)
IconBox.displayName = "IconBox"

export { IconBox }
