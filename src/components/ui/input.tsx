import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  error?: string | boolean; // accepts string error or boolean (true/false)
  showErrorText?: boolean; // optionally show error message below
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, showErrorText = true, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col">
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 md:text-sm",
            hasError
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />

        {hasError && typeof error === "string" && showErrorText && (
          <p className="text-destructive text-xs mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
