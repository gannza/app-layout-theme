import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── ListGroup root ──────────────────────────────────────── */
const listGroupVariants = cva(
  "w-full rounded-xl border border-border overflow-hidden bg-card",
  {
    variants: {
      flush: {
        true:  "rounded-none border-0 border-y",
        false: "",
      },
      divided: {
        true:  "[&>*+*]:border-t [&>*+*]:border-border",
        false: "",
      },
    },
    defaultVariants: {
      flush: false,
      divided: true,
    },
  }
);

export interface ListGroupProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof listGroupVariants> {}

const ListGroup = React.forwardRef<HTMLUListElement, ListGroupProps>(
  ({ className, flush, divided, ...props }, ref) => (
    <ul
      ref={ref}
      role="list"
      className={cn(listGroupVariants({ flush, divided }), className)}
      {...props}
    />
  )
);
ListGroup.displayName = "ListGroup";

/* ── ListGroupItem variants ──────────────────────────────── */
const listGroupItemVariants = cva(
  [
    "flex items-center gap-3 px-4 py-3",
    "text-ds-md text-foreground",
    "transition-colors duration-fast ease-smooth",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-card hover:bg-accent/50",
        primary: "bg-primary-muted text-primary hover:bg-primary/15",
        success: "bg-success-muted text-success hover:bg-success/15",
        danger:  "bg-danger-muted text-danger hover:bg-danger/15",
        warning: "bg-warning-muted text-warning-foreground hover:bg-warning/15",
        info:    "bg-info-muted text-info hover:bg-info/15",
      },
      active: {
        true:  "bg-primary/10 text-primary font-medium",
        false: "",
      },
      disabled: {
        true:  "opacity-50 pointer-events-none cursor-not-allowed",
        false: "",
      },
      clickable: {
        true:  "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
      disabled: false,
      clickable: false,
    },
  }
);

export interface ListGroupItemProps
  extends React.HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof listGroupItemVariants> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  description?: string;
  chevron?: boolean;
  href?: string;
}

const ListGroupItem = React.forwardRef<HTMLLIElement, ListGroupItemProps>(
  (
    {
      className,
      variant,
      active,
      disabled,
      clickable,
      icon,
      action,
      badge,
      description,
      chevron = false,
      href,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = Boolean(onClick || href || clickable);

    const content = (
      <>
        {icon && (
          <span className="shrink-0 flex items-center justify-center text-current opacity-70">
            {icon}
          </span>
        )}
        <span className="flex-1 min-w-0">
          <span className="block truncate">{children}</span>
          {description && (
            <span className="block text-ds-xs text-muted-foreground mt-0.5 truncate">
              {description}
            </span>
          )}
        </span>
        {badge && <span className="shrink-0">{badge}</span>}
        {action && <span className="shrink-0">{action}</span>}
        {chevron && (
          <ChevronRight
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        )}
      </>
    );

    if (href) {
      return (
        <li ref={ref} className={cn(listGroupItemVariants({ variant, active, disabled, clickable: true }), className)} {...props}>
          <a href={href} className="flex items-center gap-3 w-full">
            {content}
          </a>
        </li>
      );
    }

    return (
      <li
        ref={ref}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        onClick={!disabled ? onClick : undefined}
        onKeyDown={
          isInteractive && !disabled
            ? (e) => { if (e.key === "Enter" || e.key === " ") onClick?.(e as unknown as React.MouseEvent<HTMLLIElement>); }
            : undefined
        }
        className={cn(
          listGroupItemVariants({ variant, active, disabled, clickable: isInteractive }),
          className
        )}
        {...props}
      >
        {content}
      </li>
    );
  }
);
ListGroupItem.displayName = "ListGroupItem";

export { ListGroup, ListGroupItem, listGroupVariants, listGroupItemVariants };
