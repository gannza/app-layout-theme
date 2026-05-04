import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: string | boolean;
  hint?: string;
  showErrorText?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, hint, showErrorText = true, resize = "vertical", ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full flex flex-col gap-1">
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2",
            "text-ds-md placeholder:text-muted-foreground",
            "transition-colors duration-fast ease-smooth",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            "read-only:bg-muted/50 read-only:cursor-default",
            hasError
              ? "border-danger focus-visible:ring-danger/40 focus-visible:border-danger"
              : "border-input hover:border-border-strong focus-visible:ring-ring focus-visible:border-ring",
            resize === "none"       && "resize-none",
            resize === "vertical"   && "resize-y",
            resize === "horizontal" && "resize-x",
            resize === "both"       && "resize",
            className
          )}
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

Textarea.displayName = "Textarea";

export { Textarea };
