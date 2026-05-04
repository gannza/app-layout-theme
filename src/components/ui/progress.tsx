import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const progressTrackVariants = cva(
  "relative w-full overflow-hidden rounded-full",
  {
    variants: {
      colorScheme: {
        primary:   "bg-primary/15 dark:bg-primary/20",
        success:   "bg-success/15 dark:bg-success/20",
        danger:    "bg-danger/15 dark:bg-danger/20",
        warning:   "bg-warning/15 dark:bg-warning/20",
        info:      "bg-info/15 dark:bg-info/20",
        secondary: "bg-secondary",
      },
      size: {
        xs:      "h-1",
        sm:      "h-1.5",
        default: "h-2",
        lg:      "h-3",
        xl:      "h-4",
      },
    },
    defaultVariants: {
      colorScheme: "primary",
      size: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 rounded-full transition-all duration-slow ease-smooth",
  {
    variants: {
      colorScheme: {
        primary:   "bg-primary",
        success:   "bg-success",
        danger:    "bg-danger",
        warning:   "bg-warning",
        info:      "bg-info",
        secondary: "bg-secondary-foreground",
      },
      striped: {
        true: [
          "bg-[length:1rem_1rem]",
          "bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.15)_4px,rgba(255,255,255,0.15)_8px)]",
        ].join(" "),
        false: "",
      },
      animated: {
        true:  "animate-ds-pulse",
        false: "",
      },
    },
    defaultVariants: {
      colorScheme: "primary",
      striped: false,
      animated: false,
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressTrackVariants> {
  striped?: boolean;
  animated?: boolean;
  showLabel?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, value, colorScheme, size, striped = false, animated = false, showLabel = false, ...props },
    ref
  ) => (
    <div className={cn("w-full", showLabel && "flex items-center gap-3")}>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          progressTrackVariants({ colorScheme, size }),
          showLabel && "flex-1",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            progressIndicatorVariants({ colorScheme, striped, animated })
          )}
          style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <span className="text-ds-xs text-muted-foreground tabular-nums w-8 text-right shrink-0">
          {Math.round(value ?? 0)}%
        </span>
      )}
    </div>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressTrackVariants };
