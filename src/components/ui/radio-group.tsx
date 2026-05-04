import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioItemVariants = cva(
  [
    "aspect-square shrink-0 rounded-full border shadow-xs",
    "transition-all duration-fast ease-smooth",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      colorScheme: {
        primary: [
          "border-input focus-visible:ring-ring",
          "data-[state=checked]:border-primary",
          "[&[data-state=checked]>span]:bg-primary",
        ].join(" "),
        success: [
          "border-input focus-visible:ring-success/40",
          "data-[state=checked]:border-success",
          "[&[data-state=checked]>span]:bg-success",
        ].join(" "),
        danger: [
          "border-input focus-visible:ring-danger/40",
          "data-[state=checked]:border-danger",
          "[&[data-state=checked]>span]:bg-danger",
        ].join(" "),
        warning: [
          "border-input focus-visible:ring-warning/40",
          "data-[state=checked]:border-warning",
          "[&[data-state=checked]>span]:bg-warning",
        ].join(" "),
        info: [
          "border-input focus-visible:ring-info/40",
          "data-[state=checked]:border-info",
          "[&[data-state=checked]>span]:bg-info",
        ].join(" "),
      },
      size: {
        sm:      "h-3.5 w-3.5 [&>span]:h-1.5 [&>span]:w-1.5",
        default: "h-4 w-4 [&>span]:h-2 [&>span]:w-2",
        lg:      "h-5 w-5 [&>span]:h-2.5 [&>span]:w-2.5",
        xl:      "h-6 w-6 [&>span]:h-3 [&>span]:w-3",
      },
    },
    defaultVariants: {
      colorScheme: "primary",
      size: "default",
    },
  }
);

/* ── RadioGroup root ─────────────────────────────────────── */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn("grid gap-2", className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/* ── RadioGroupItem ──────────────────────────────────────── */
export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {
  label?: string;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, colorScheme, size, label, ...props }, ref) => {
  const item = (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioItemVariants({ colorScheme, size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="rounded-full transition-transform duration-fast scale-100" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );

  if (label) {
    return (
      <label className="flex items-center gap-2 cursor-pointer select-none group">
        {item}
        <span className="text-ds-md text-foreground group-has-[:disabled]:opacity-50 group-has-[:disabled]:cursor-not-allowed">
          {label}
        </span>
      </label>
    );
  }

  return item;
});


RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem, radioItemVariants };
