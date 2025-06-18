
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const creamBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 shadow-sm border",
  {
    variants: {
      variant: {
        default: "bg-stone-100 text-gray-800 border-stone-200 hover:bg-stone-200",
        success: "bg-stone-100 text-green-700 border-stone-200 hover:bg-stone-200",
        warning: "bg-stone-100 text-orange-700 border-stone-200 hover:bg-stone-200",
        error: "bg-stone-100 text-red-700 border-stone-200 hover:bg-stone-200",
        info: "bg-stone-100 text-blue-700 border-stone-200 hover:bg-stone-200",
        neutral: "bg-stone-100 text-gray-700 border-stone-200 hover:bg-stone-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CreamBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof creamBadgeVariants> {}

function CreamBadge({ className, variant, size, ...props }: CreamBadgeProps) {
  return (
    <div className={cn(creamBadgeVariants({ variant, size }), className)} {...props} />
  )
}

export { CreamBadge, creamBadgeVariants }
