import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps & { input_variant?: string }>(
  ({ className, type, input_variant, ...props }, ref) => {
    return (
      <div className="!w-full box-border">
        <input
          type={type}
          className={cn(
            input_variant === 'no-border'
              ? 'pl-2 rounded-md disabled:bg-transparent disabled:opacity-100'
              : 'bg-background rounded-md border border-input px-3 focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-90 disabled:bg-gray-100',
            "flex h-10 w-full py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
