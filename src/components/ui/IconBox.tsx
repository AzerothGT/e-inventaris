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
      primary: "bg-primary-50/70 border border-primary-100/50 text-primary-600",
      warning: "bg-warning-50/70 border border-warning-100/50 text-warning-600",
      danger: "bg-danger-50/70 border border-danger-100/50 text-danger-600",
      success: "bg-success-50/70 border border-success-100/50 text-success-600",
      surface: "bg-surface-100/70 border border-surface-200/50 text-surface-600",
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
