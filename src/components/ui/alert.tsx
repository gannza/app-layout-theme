import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative w-full rounded-lg border px-4 py-3 text-ds-sm",
    "flex items-start gap-3",
    "[&>svg]:shrink-0 [&>svg]:mt-0.5",
    "bg-gradient-to-br",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "from-background to-muted/30 text-foreground border-border [&>svg]:text-foreground",
        primary:
          "from-primary-muted to-background text-primary border-primary/20 dark:from-primary/15 dark:to-background dark:border-primary/30 [&>svg]:text-primary",
        success:
          "from-success-muted to-background text-success border-success/20 dark:from-success/15 dark:to-background dark:border-success/30 [&>svg]:text-success",
        danger:
          "from-danger-muted to-background text-danger border-danger/20 dark:from-danger/15 dark:to-background dark:border-danger/30 [&>svg]:text-danger",
        warning:
          "from-warning-muted to-background text-warning-foreground border-warning/20 dark:from-warning/15 dark:to-background dark:border-warning/30 [&>svg]:text-warning",
        info:
          "from-info-muted to-background text-info border-info/20 dark:from-info/15 dark:to-background dark:border-info/30 [&>svg]:text-info",
        /* legacy alias */
        destructive:
          "from-danger-muted to-background text-danger border-danger/20 dark:from-danger/15 dark:to-background dark:border-danger/30 [&>svg]:text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const ALERT_ICONS: Record<string, React.ElementType> = {
  success:     CheckCircle2,
  danger:      XCircle,
  destructive: XCircle,
  warning:     AlertTriangle,
  info:        Info,
  primary:     Info,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Auto-render a matching icon based on variant */
  icon?: boolean | React.ReactNode;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", icon = true, onDismiss, children, ...props }, ref) => {
    const IconComp =
      icon === true
        ? ALERT_ICONS[variant ?? "default"]
        : null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon === true && IconComp && (
          <IconComp className="h-4 w-4" aria-hidden />
        )}
        {icon !== true && icon !== false && (
          <span className="flex shrink-0 mt-0.5">{icon}</span>
        )}

        <div className="flex-1 min-w-0">{children}</div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className={cn(
              "shrink-0 rounded p-0.5 opacity-60 hover:opacity-100",
              "transition-opacity duration-fast ease-smooth",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold text-ds-sm leading-tight tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-ds-sm opacity-90 [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
