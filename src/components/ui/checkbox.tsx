import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const checkboxVariants = cva(
  [
    "peer shrink-0 rounded-md border shadow-xs",
    "transition-all duration-fast ease-smooth",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      colorScheme: {
        primary: [
          "border-input focus-visible:ring-ring",
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
          "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
        ].join(" "),
        success: [
          "border-input focus-visible:ring-success/40",
          "data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground",
          "data-[state=indeterminate]:bg-success data-[state=indeterminate]:border-success data-[state=indeterminate]:text-success-foreground",
        ].join(" "),
        danger: [
          "border-input focus-visible:ring-danger/40",
          "data-[state=checked]:bg-danger data-[state=checked]:border-danger data-[state=checked]:text-danger-foreground",
          "data-[state=indeterminate]:bg-danger data-[state=indeterminate]:border-danger data-[state=indeterminate]:text-danger-foreground",
        ].join(" "),
        warning: [
          "border-input focus-visible:ring-warning/40",
          "data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=checked]:text-warning-foreground",
          "data-[state=indeterminate]:bg-warning data-[state=indeterminate]:border-warning data-[state=indeterminate]:text-warning-foreground",
        ].join(" "),
        info: [
          "border-input focus-visible:ring-info/40",
          "data-[state=checked]:bg-info data-[state=checked]:border-info data-[state=checked]:text-info-foreground",
          "data-[state=indeterminate]:bg-info data-[state=indeterminate]:border-info data-[state=indeterminate]:text-info-foreground",
        ].join(" "),
      },
      size: {
        sm:      "h-3.5 w-3.5 rounded-[3px] [&_svg]:h-2.5 [&_svg]:w-2.5",
        default: "h-4 w-4 [&_svg]:h-3 [&_svg]:w-3",
        lg:      "h-5 w-5 rounded-md [&_svg]:h-3.5 [&_svg]:w-3.5",
        xl:      "h-6 w-6 rounded-md [&_svg]:h-4 [&_svg]:w-4",
      },
    },
    defaultVariants: {
      colorScheme: "primary",
      size: "default",
    },
  }
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  indeterminate?: boolean;
  label?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, colorScheme, size, label, ...props }, ref) => {
  const checkbox = (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ colorScheme, size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {props.checked === "indeterminate" ? (
          <Minus strokeWidth={3} />
        ) : (
          <Check strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label) {
    return (
      <label className="flex items-center gap-2 cursor-pointer select-none group">
        {checkbox}
        <span className="text-ds-md text-foreground group-has-[:disabled]:opacity-50 group-has-[:disabled]:cursor-not-allowed">
          {label}
        </span>
      </label>
    );
  }

  return checkbox;
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants };
