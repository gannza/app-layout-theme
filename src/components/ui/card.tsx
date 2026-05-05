import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Card variants (border + elevation only — gradient lives on CardHeader) ── */
const cardVariants = cva(
  [
    "relative rounded-xl border bg-card text-card-foreground overflow-hidden",
    "transition-colors duration-normal ease-smooth",
  ].join(" "),
  {
    variants: {
      variant: {
        default:  "border-border",
        primary:  "border-primary/25",
        success:  "border-success/25",
        danger:   "border-danger/25",
        warning:  "border-warning/25",
        info:     "border-info/25",
      },
      elevation: {
        flat:    "shadow-none",
        raised:  "shadow-xs",
        medium:  "shadow-sm",
        high:    "shadow-md",
        overlay: "shadow-lg",
      },
      hoverable: {
        true:  "hover:border-primary/30 hover:shadow-sm cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant:   "default",
      elevation: "flat",
      hoverable: false,
    },
  }
);

/* ── CardHeader variants (gradient applied here, not on the Card root) ── */
const cardHeaderVariants = cva(
  "bg-gradient-to-br transition-colors duration-normal ease-smooth",
  {
    variants: {
      variant: {
        default:  "from-card to-muted/20",
        primary:  "from-primary-muted to-background text-primary",
        success:  "from-success-muted to-background text-success",
        danger:   "from-danger-muted  to-background text-danger",
        warning:  "from-warning-muted to-background text-warning-foreground",
        info:     "from-info-muted    to-background text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* ── Card root ───────────────────────────────────────────── */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, elevation, hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, elevation, hoverable }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

/* ── CardHeader ──────────────────────────────────────────── */
export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {
  action?: React.ReactNode;
  divider?: boolean;
  accent?: boolean;
  onClose?: () => void;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { className, variant, action, divider = false, accent = false, onClose, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex items-start justify-between gap-3 px-5 py-4",
        cardHeaderVariants({ variant }),
        accent && "bg-gradient-to-r from-primary/8 to-transparent dark:from-primary/12",
        divider && "border-b border-border",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1 shrink-0">
        {action}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "rounded-md p-1 text-muted-foreground",
              "hover:bg-accent hover:text-foreground",
              "transition-colors duration-fast ease-smooth",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
);
CardHeader.displayName = "CardHeader";

/* ── CardTitle ───────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-ds-base font-semibold leading-tight tracking-tight text-card-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* ── CardDescription ─────────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-0.5 text-ds-sm text-muted-foreground leading-snug", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* ── CardBody (alias: CardContent) ───────────────────────── */
const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-5 py-4", className)} {...props} />
));
CardBody.displayName = "CardBody";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-5 py-4 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/* ── CardFooter ──────────────────────────────────────────── */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-2 px-5 py-4",
        divider && "border-t border-border",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardContent,
  CardFooter,
  cardVariants,
  cardHeaderVariants,
};
