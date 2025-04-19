import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        outline2:
          "border-2 border-blue-800 text-blue-800 bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primary: "bg-blue-pnm text-white hover:bg-blue-900",
        green: "bg-green-pnm text-white hover:bg-green-pnm/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        orange: "text-orange-500 bg-orange-100 hover:bg-orange-200",
        blue: "text-blue-500 bg-blue-100 hover:bg-blue-200",
        blue_outline:
          "border-2 border-blue-pnm bg-blue-50 hover:bg-accent text-blue-pnm",
      },
      size: {
        default: "h-10 px-4 py-1",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xs: "h-8 px-2 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  qa: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, qa, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        qa-button={qa}
        className={cn(buttonVariants({ variant, size, className }), 'transition-all duration-300 cursor-pointer')}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
