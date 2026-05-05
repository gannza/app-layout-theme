import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 font-medium transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        /* ── Solid ───────────────────────────────── */
        primary:
          "border-transparent bg-primary text-[#ffffff] hover:bg-primary-hover",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        success:
          "border-transparent bg-success text-[#ffffff] hover:bg-success-hover",
        danger:
          "border-transparent bg-danger text-[#ffffff] hover:bg-danger-hover",
        warning:
          "border-transparent bg-warning text-[#ffffff] hover:bg-warning-hover",
        info:
          "border-transparent bg-info text-[#ffffff] hover:bg-info-hover",
        dark:
          "border-transparent bg-dark text-[#ffffff] hover:bg-dark-hover",

        /* ── Soft / Muted ────────────────────────── */
        "soft-primary":
          "border-transparent bg-primary-muted text-primary",
        "soft-success":
          "border-transparent bg-success-muted text-success",
        "soft-danger":
          "border-transparent bg-danger-muted text-danger",
        "soft-warning":
          "border-transparent bg-warning-muted text-warning",
        "soft-info":
          "border-transparent bg-info-muted text-info",

        /* ── Outline ─────────────────────────────── */
        outline:
          "border border-border text-foreground bg-transparent",
        "outline-primary":
          "border border-primary text-primary bg-transparent",
        "outline-success":
          "border border-success text-success bg-transparent",
        "outline-danger":
          "border border-danger text-danger bg-transparent",
        "outline-warning":
          "border border-warning text-warning bg-transparent",
        "outline-info":
          "border border-info text-info bg-transparent",

        /* ── Legacy aliases ──────────────────────── */
        default:
          "border-transparent bg-primary text-[#ffffff] hover:bg-primary-hover",
        destructive:
          "border-transparent bg-danger text-[#ffffff] hover:bg-danger-hover",
      },

      size: {
        sm:      "rounded-md border px-1.5 py-px text-[0.6rem]",
        default: "rounded-md border px-2 py-0.5 text-xs",
        lg:      "rounded-lg border px-2.5 py-1 text-ds-sm",
      },

      dot: {
        true:  "pl-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      dot: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, dot }), className)}
      {...props}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
          aria-hidden
        />
      )}
      {props.children}
    </span>
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
