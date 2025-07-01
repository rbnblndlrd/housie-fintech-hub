
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // Check if this card is using fintech styling
  const isFintech = className?.includes('fintech-');
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl shadow-lg",
        // Only apply default card styling if NOT using fintech classes
        !isFintech && "text-card-foreground",
        className
      )}
      style={!isFintech ? {
        backgroundColor: '#F8F6F0',
        border: '2px solid #000000',
        color: '#000000'
      } : undefined}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const isFintech = className?.includes('fintech-') || 
                   props['data-fintech'] || 
                   React.useContext(React.createContext(false));
  
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      style={!isFintech ? { color: '#000000' } : undefined}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const isFintech = className?.includes('fintech-') || 
                   props['data-fintech'] || 
                   React.useContext(React.createContext(false));
  
  return (
    <p
      ref={ref}
      className={cn("text-sm", className)}
      style={!isFintech ? { color: 'rgba(0, 0, 0, 0.7)' } : undefined}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
