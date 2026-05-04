import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  [
    "flex w-full rounded-lg border bg-background px-3 text-ds-md",
    "placeholder:text-muted-foreground",
    "transition-colors duration-fast ease-smooth",
    "file:border-0 file:bg-transparent file:text-ds-sm file:font-medium file:text-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
    "read-only:bg-muted/50 read-only:cursor-default",
  ].join(" "),
  {
    variants: {
      size: {
        sm:      "h-7 px-2.5 text-ds-sm rounded-md",
        default: "h-9 py-1.5",
        lg:      "h-11 px-4 text-ds-base",
      },
      state: {
        default: "border-input hover:border-border-strong focus-visible:border-ring",
        error:   "border-danger focus-visible:ring-danger/40 focus-visible:border-danger",
        success: "border-success focus-visible:ring-success/40 focus-visible:border-success",
        warning: "border-warning focus-visible:ring-warning/40 focus-visible:border-warning",
      },
    },
    defaultVariants: {
      size: "default",
      state: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  error?: string | boolean;
  hint?: string;
  showErrorText?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size,
      error,
      hint,
      showErrorText = true,
      iconStart,
      iconEnd,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const resolvedState: VariantProps<typeof inputVariants>["state"] =
      hasError ? "error" : "default";

    if (iconStart || iconEnd) {
      return (
        <div className="w-full flex flex-col gap-1">
          <div className="relative flex items-center">
            {iconStart && (
              <span className="absolute left-3 flex items-center text-muted-foreground pointer-events-none">
                {iconStart}
              </span>
            )}
            <input
              type={type}
              ref={ref}
              className={cn(
                inputVariants({ size, state: resolvedState }),
                iconStart && "pl-9",
                iconEnd && "pr-9",
                className
              )}
              {...props}
            />
            {iconEnd && (
              <span className="absolute right-3 flex items-center text-muted-foreground pointer-events-none">
                {iconEnd}
              </span>
            )}
          </div>
          {hasError && typeof error === "string" && showErrorText && (
            <p className="text-danger text-ds-xs">{error}</p>
          )}
          {!hasError && hint && (
            <p className="text-muted-foreground text-ds-xs">{hint}</p>
          )}
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col gap-1">
        <input
          type={type}
          ref={ref}
          className={cn(inputVariants({ size, state: resolvedState }), className)}
          {...props}
        />
        {hasError && typeof error === "string" && showErrorText && (
          <p className="text-danger text-ds-xs">{error}</p>
        )}
        {!hasError && hint && (
          <p className="text-muted-foreground text-ds-xs">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
