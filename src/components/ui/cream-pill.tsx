
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const creamPillVariants = cva(
  "inline-flex items-center justify-center rounded-full font-bold text-xs transition-all duration-200 shadow-sm border",
  {
    variants: {
      variant: {
        default: "bg-stone-100 text-gray-800 border-stone-200",
        notification: "bg-stone-100 text-gray-800 border-stone-200 animate-pulse",
        count: "bg-stone-100 text-gray-800 border-stone-200 font-semibold",
      },
      size: {
        sm: "min-w-[16px] h-4 px-1.5 text-xs",
        default: "min-w-[20px] h-5 px-2 text-xs",
        lg: "min-w-[24px] h-6 px-2.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CreamPillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof creamPillVariants> {}

function CreamPill({ className, variant, size, ...props }: CreamPillProps) {
  return (
    <div className={cn(creamPillVariants({ variant, size }), className)} {...props} />
  )
}

export { CreamPill, creamPillVariants }
