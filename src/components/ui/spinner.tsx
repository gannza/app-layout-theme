import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block rounded-full border-2 border-current border-t-transparent animate-ds-spin",
  {
    variants: {
      colorScheme: {
        primary:   "text-primary",
        secondary: "text-muted-foreground",
        success:   "text-success",
        danger:    "text-danger",
        warning:   "text-warning",
        info:      "text-info",
        dark:      "text-dark",
        white:     "text-white",
        inherit:   "text-current",
      },
      size: {
        xs:      "h-3 w-3 border-[1.5px]",
        sm:      "h-4 w-4",
        default: "h-5 w-5",
        lg:      "h-6 w-6 border-[2.5px]",
        xl:      "h-8 w-8 border-[3px]",
        xxl:     "h-10 w-10 border-[3px]",
      },
      speed: {
        fast:    "animate-ds-spin-fast",
        normal:  "animate-ds-spin",
        slow:    "[animation-duration:600ms]",
      },
    },
    defaultVariants: {
      colorScheme: "primary",
      size: "default",
      speed: "normal",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, colorScheme, size, speed, label = "Loading...", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center gap-2", props["aria-hidden"] && "gap-0")}
      {...props}
    >
      <span
        className={cn(spinnerVariants({ colorScheme, size, speed }), className)}
        aria-hidden="true"
      />
      {label && !props["aria-hidden"] && (
        <span className="sr-only">{label}</span>
      )}
    </span>
  )
);
Spinner.displayName = "Spinner";

/* ── SpinnerOverlay: full-area loading overlay ───────────── */
const SpinnerOverlay = ({
  label = "Loading...",
  className,
  ...props
}: SpinnerProps & { className?: string }) => (
  <div
    className={cn(
      "absolute inset-0 z-10 flex items-center justify-center",
      "bg-background/60 backdrop-blur-[2px] rounded-[inherit]",
      className
    )}
  >
    <Spinner {...props} label={label} size={props.size ?? "lg"} />
  </div>
);
SpinnerOverlay.displayName = "SpinnerOverlay";

export { Spinner, SpinnerOverlay, spinnerVariants };
