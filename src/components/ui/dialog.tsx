import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

/* ── Overlay with backdrop blur ──────────────────────────── */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "duration-normal",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/* ── Content: size + border color only — gradient lives on DialogHeader ── */
const dialogContentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
    "grid w-full gap-0",
    "border rounded-xl shadow-modal overflow-hidden",
    "bg-popover text-popover-foreground",
    "duration-normal",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  ].join(" "),
  {
    variants: {
      size: {
        sm:      "max-w-sm",
        default: "max-w-lg",
        md:      "max-w-xl",
        lg:      "max-w-2xl",
        xl:      "max-w-4xl",
        full:    "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
      },
      variant: {
        default: "border-border",
        primary: "border-primary/25",
        success: "border-success/25",
        danger:  "border-danger/25",
        warning: "border-warning/25",
        info:    "border-info/25",
      },
    },
    defaultVariants: {
      size:    "default",
      variant: "default",
    },
  }
);

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  hideClose?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size, variant, hideClose = false, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ size, variant }), className)}
      {...props}
    >
      {children}
      {!hideClose && (
        <DialogPrimitive.Close
          className={cn(
            "absolute right-4 top-4 z-10 rounded-lg p-1.5",
            "text-muted-foreground opacity-70",
            "hover:opacity-100 hover:bg-accent hover:text-foreground",
            "transition-all duration-fast ease-smooth",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none"
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/* ── DialogHeader variants (gradient applied here) ───────── */
const dialogHeaderVariants = cva(
  "bg-gradient-to-br transition-colors duration-normal ease-smooth",
  {
    variants: {
      variant: {
        default: "from-popover to-muted/30",
        primary: "from-primary-muted to-background text-primary",
        success: "from-success-muted to-background text-success",
        danger:  "from-danger-muted  to-background text-danger",
        warning: "from-warning-muted to-background text-warning-foreground",
        info:    "from-info-muted    to-background text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface DialogHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogHeaderVariants> {
  divider?: boolean;
}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, variant, divider = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1 px-6 py-4 pr-12",
        dialogHeaderVariants({ variant }),
        divider && "border-b border-border",
        className
      )}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

/* ── DialogBody ──────────────────────────────────────────── */
const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-4", className)} {...props} />
));
DialogBody.displayName = "DialogBody";

/* ── DialogFooter ────────────────────────────────────────── */
const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { divider?: boolean }
>(({ className, divider = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end",
      divider && "border-t border-border",
      className
    )}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

/* ── DialogTitle ─────────────────────────────────────────── */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-ds-base font-semibold leading-tight text-foreground", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/* ── DialogDescription ───────────────────────────────────── */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-ds-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  dialogHeaderVariants,
};
