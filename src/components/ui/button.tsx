import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "rounded-lg border border-transparent",
    "transition-all duration-normal ease-smooth",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /* ── Solid fills ─────────────────────────────── */
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-active",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover active:bg-secondary-active border-border",
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success-hover active:bg-success-active",
        danger:
          "bg-danger text-danger-foreground shadow-sm hover:bg-danger-hover active:bg-danger-active",
        warning:
          "bg-warning text-warning-foreground shadow-sm hover:bg-warning-hover active:bg-warning-active",
        info:
          "bg-info text-info-foreground shadow-sm hover:bg-info-hover active:bg-info-active",
        light:
          "bg-light text-light-foreground shadow-sm hover:bg-light-hover active:bg-light-active border-border",
        dark:
          "bg-dark text-dark-foreground shadow-sm hover:bg-dark-hover active:bg-dark-active",

        /* ── Outline variants ────────────────────────── */
        "outline-primary":
          "border-primary text-primary bg-transparent hover:bg-primary/10 active:bg-primary/20",
        "outline-secondary":
          "border-border text-secondary-foreground bg-transparent hover:bg-secondary active:bg-secondary-hover",
        "outline-success":
          "border-success text-success bg-transparent hover:bg-success/10 active:bg-success/20",
        "outline-danger":
          "border-danger text-danger bg-transparent hover:bg-danger/10 active:bg-danger/20",
        "outline-warning":
          "border-warning text-warning-foreground bg-transparent hover:bg-warning/10 active:bg-warning/20",
        "outline-info":
          "border-info text-info bg-transparent hover:bg-info/10 active:bg-info/20",

        /* ── Soft / Muted variants ───────────────────── */
        "soft-primary":
          "bg-primary-muted text-primary hover:bg-primary/20 active:bg-primary/30",
        "soft-success":
          "bg-success-muted text-success hover:bg-success/20 active:bg-success/30",
        "soft-danger":
          "bg-danger-muted text-danger hover:bg-danger/20 active:bg-danger/30",
        "soft-warning":
          "bg-warning-muted text-warning-foreground hover:bg-warning/20 active:bg-warning/30",
        "soft-info":
          "bg-info-muted text-info hover:bg-info/20 active:bg-info/30",

        /* ── Legacy / ShadCN compat aliases ─────────── */
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-active",
        destructive:
          "bg-danger text-danger-foreground shadow-sm hover:bg-danger-hover active:bg-danger-active",
        outline:
          "border-border text-foreground bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground",
        link:
          "text-primary underline-offset-4 hover:underline hover:text-primary-hover p-0 h-auto",

        /* ── Primary-light (backward compat) ─────────── */
        "primary-light":
          "bg-primary-muted text-primary hover:bg-primary/20 active:bg-primary/30",
      },

      size: {
        xs:      "h-6 px-2 text-[0.6875rem] [&_svg]:size-3 rounded-md",
        sm:      "h-7 px-3 text-ds-sm [&_svg]:size-3.5 rounded-md",
        default: "h-9 px-4 py-2 text-ds-md [&_svg]:size-4",
        md:      "h-9 px-4 py-2 text-ds-md [&_svg]:size-4",
        lg:      "h-10 px-5 text-ds-base [&_svg]:size-4",
        xl:      "h-11 px-6 text-ds-lg [&_svg]:size-5",
        xxl:     "h-12 px-8 text-ds-xl [&_svg]:size-5",
        icon:    "h-9 w-9 p-0 [&_svg]:size-4",
        "icon-sm":  "h-7 w-7 p-0 [&_svg]:size-3.5",
        "icon-lg":  "h-10 w-10 p-0 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type BaseButtonProps = {
  asChild?: boolean;
  title?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  block?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

type NativeButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    type?: "button" | "submit" | "reset";
  };

type AnchorButtonProps = BaseButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    type: "link";
    href: string;
  };

type NavLinkButtonProps = BaseButtonProps &
  NavLinkProps & {
    type: "navlink";
    to: string;
  };

export type ButtonProps =
  | NativeButtonProps
  | AnchorButtonProps
  | NavLinkButtonProps;

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      title,
      type = "button",
      iconStart,
      iconEnd,
      block = false,
      isLoading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const finalVariant =
      (type === "link" || type === "navlink") && !variant ? "link" : variant;

    const spinnerSize =
      size === "xs" || size === "sm" || size === "icon-sm"
        ? "h-3 w-3"
        : size === "xl" || size === "xxl" || size === "icon-lg"
        ? "h-5 w-5"
        : "h-4 w-4";

    const commonClasses = cn(
      buttonVariants({ variant: finalVariant, size }),
      block && "w-full",
      isLoading && "cursor-wait opacity-80",
      className
    );

    const content = isLoading ? (
      <>
        <Loader2 className={cn("animate-ds-spin", spinnerSize)} aria-hidden />
        <span>{loadingText ?? (typeof children === "string" ? children : null)}</span>
      </>
    ) : size === "icon" || size === "icon-sm" || size === "icon-lg" ? (
      <span className="flex items-center justify-center">
        {iconStart || iconEnd || children}
      </span>
    ) : (
      <>
        {iconStart && <span className="flex items-center shrink-0">{iconStart}</span>}
        {children != null && <span className="inline-flex">{children}</span>}
        {iconEnd && <span className="flex items-center shrink-0">{iconEnd}</span>}
      </>
    );

    const commonProps = {
      className: commonClasses,
      tabIndex: 0,
      "aria-disabled": isLoading || disabled,
      "aria-busy": isLoading,
      disabled: isLoading || disabled,
    };

    if (type === "link") {
      const anchorProps = props as AnchorButtonProps;
      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...anchorProps}
          {...commonProps}
          title={title}
          target={anchorProps.target ?? "_blank"}
          rel={anchorProps.rel ?? "noopener noreferrer"}
        >
          {content}
        </a>
      );
    }

    if (type === "navlink") {
      return (
        <NavLink
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...(props as NavLinkButtonProps)}
          {...commonProps}
          title={title}
        >
          {content}
        </NavLink>
      );
    }

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...(props as NativeButtonProps)}
        {...commonProps}
        title={title}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

/* ── Button Group container ──────────────────────────────── */
const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { vertical?: boolean }
>(({ className, vertical = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "btn-group inline-flex",
      vertical ? "flex-col" : "flex-row",
      vertical && "[&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none",
      className
    )}
    {...props}
  />
));
ButtonGroup.displayName = "ButtonGroup";

export { Button, ButtonGroup, buttonVariants };
