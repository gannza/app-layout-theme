import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Card elevation variants ─────────────────────────────── */
const cardVariants = cva(
  "relative rounded-xl border bg-card text-card-foreground transition-shadow duration-normal ease-smooth",
  {
    variants: {
      elevation: {
        flat:    "shadow-none border-border",
        raised:  "shadow-card border-border",
        medium:  "shadow-md border-transparent",
        high:    "shadow-lg border-transparent",
        overlay: "shadow-modal border-transparent",
      },
      hoverable: {
        true:  "hover:shadow-md cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      elevation: "raised",
      hoverable: false,
    },
  }
);

/* ── Card root ───────────────────────────────────────────── */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ elevation, hoverable }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

/* ── CardHeader ──────────────────────────────────────────── */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Right-aligned content slot (icon, badge, actions) */
  action?: React.ReactNode;
  /** Show a bottom divider */
  divider?: boolean;
  /** Optional accent background on the header */
  accent?: boolean;
  onClose?: () => void;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, action, divider = false, accent = false, onClose, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-start justify-between gap-3 px-5 py-4",
        accent && "bg-primary/5 dark:bg-primary/10",
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
  /** Show a top divider */
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
};
