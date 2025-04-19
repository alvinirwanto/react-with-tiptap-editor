import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & { isInformation?: boolean, noCloseBackground?: boolean }
>(({ className, isInformation, noCloseBackground, ...props }, ref) => {
    return noCloseBackground ? (
        <DialogPrimitive.Overlay
            ref={ref}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
                "fixed inset-0 z-[300] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                isInformation ? "bg-black/40" : "bg-black/80",
                className
            )}
            {...props}
        />
    ) : (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn(
                "fixed inset-0 z-[300] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                isInformation ? "bg-black/40" : "bg-black/80",
                className
            )}
            {...props}
        />
    );
}
)
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName


const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { showClose?: boolean, isInformation?: boolean, noCloseBackground?: boolean }
>(({ className, showClose, isInformation, noCloseBackground, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay isInformation={isInformation} noCloseBackground={noCloseBackground} />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed min-h-[400px] left-[50%] top-[50%] z-[300] grid w-[90%] xl:w-full translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                isInformation ? 'p-3' : 'p-6',
                className
            )}
            {...props}
        >
            {children}
            {
                showClose && (
                    <DialogPrimitive.Close className={cn(
                        'absolute ring-offset-background transition-opacity h-6 w-6 flex justify-center items-center bg-rose-500 text-white opacity-70 hover:opacity-100 rounded-lg focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
                        isInformation ? 'right-5 top-5' : 'right-6 top-6'
                    )}>
                        <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                )
            }
        </DialogPrimitive.Content>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
