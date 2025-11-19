import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline",

        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        "outline-success":
          "border border-success bg-background text-success shadow-sm hover:bg-success/10",
        "outline-warning":
          "border border-warning bg-background text-warning shadow-sm hover:bg-warning/10",
        "outline-secondary":
          "border border-secondary bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

        // ⭐️ New variants (added back properly)
        "primary-light":
          "bg-primary/10 text-primary shadow-sm hover:bg-primary/20",
      },
      size: {
        default: "h-9 px-4 py-2 [&_svg]:size-4",
        sm: "h-8 rounded-md px-3 text-xs [&_svg]:size-3.5",
        lg: "h-10 rounded-md px-8 [&_svg]:size-5",
        icon: "h-9 w-9 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
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
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const finalVariant =
      (type === "link" || type === "navlink") && !variant ? "link" : variant;

    const commonClasses = cn(
      buttonVariants({ variant: finalVariant, size }),
      block && "w-full",
      isLoading && "opacity-75 pointer-events-none",
      className
    );

    const content = isLoading ? (
      <>
        <Loader2 className={cn("animate-spin", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
        {typeof children === "string" && children}
      </>
    ) : size === "icon" ? (
      <span className="flex items-center">
        {iconStart || iconEnd || children}
      </span>
    ) : (
      <>
        {iconStart && <span className="flex items-center">{iconStart}</span>}
        {children && <span className="hidden sm:inline-flex">{children}</span>}
        {iconEnd && <span className="flex items-center">{iconEnd}</span>}
      </>
    );

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (isLoading) return;
      if (
        type !== "button" &&
        type !== "submit" &&
        (e.key === "Enter" || e.key === " ")
      ) {
        (e.currentTarget as HTMLElement).click();
      }
    };

    const commonProps = {
      className: commonClasses,
      tabIndex: 0,
      "aria-disabled": isLoading || disabled,
      "aria-busy": isLoading,
      onKeyDown: handleKeyPress,
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
          target={anchorProps.target || "_blank"}
          rel={anchorProps.rel || "noopener"}
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

export { Button, buttonVariants };
