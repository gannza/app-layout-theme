import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Context for CollapseGroup (single vs multiple) ──────── */
interface CollapseGroupCtx {
  type: "single" | "multiple";
  openItems: string[];
  toggle: (id: string) => void;
}
const CollapseGroupContext = React.createContext<CollapseGroupCtx | null>(null);

/* ── CollapseGroup ───────────────────────────────────────── */
export interface CollapseGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultOpen?: string | string[];
  divided?: boolean;
  flush?: boolean;
}

const CollapseGroup = React.forwardRef<HTMLDivElement, CollapseGroupProps>(
  ({ className, type = "single", defaultOpen, divided = true, flush = false, children, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<string[]>(() => {
      if (!defaultOpen) return [];
      return Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
    });

    const toggle = React.useCallback(
      (id: string) => {
        setOpenItems((prev) => {
          if (type === "single") {
            return prev.includes(id) ? [] : [id];
          }
          return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
        });
      },
      [type]
    );

    return (
      <CollapseGroupContext.Provider value={{ type, openItems, toggle }}>
        <div
          ref={ref}
          className={cn(
            "w-full",
            !flush && "rounded-xl border border-border overflow-hidden bg-card",
            divided && "[&>*+*]:border-t [&>*+*]:border-border",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CollapseGroupContext.Provider>
    );
  }
);
CollapseGroup.displayName = "CollapseGroup";

/* ── Collapse item ───────────────────────────────────────── */
const collapseVariants = cva("", {
  variants: {
    variant: {
      default: "bg-card",
      ghost:   "bg-transparent",
      filled:  "bg-muted/40",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CollapseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapseVariants> {
  itemId?: string;
  defaultOpen?: boolean;
}

const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  ({ className, variant, itemId, defaultOpen = false, children, ...props }, ref) => {
    const ctx = React.useContext(CollapseGroupContext);
    const [localOpen, setLocalOpen] = React.useState(defaultOpen);

    const isOpen = ctx ? ctx.openItems.includes(itemId ?? "") : localOpen;

    const handleToggle = () => {
      if (ctx && itemId) {
        ctx.toggle(itemId);
      } else {
        setLocalOpen((v) => !v);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(collapseVariants({ variant }), className)}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          if (
            (child.type as { displayName?: string }).displayName === "CollapseTrigger"
          ) {
            return React.cloneElement(child as React.ReactElement<CollapseTriggerProps>, {
              isOpen,
              onToggle: handleToggle,
            });
          }
          if (
            (child.type as { displayName?: string }).displayName === "CollapseContent"
          ) {
            return React.cloneElement(child as React.ReactElement<CollapseContentProps>, {
              isOpen,
            });
          }
          return child;
        })}
      </div>
    );
  }
);
Collapse.displayName = "Collapse";

/* ── CollapseTrigger ─────────────────────────────────────── */
interface CollapseTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  onToggle?: () => void;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
}

const CollapseTrigger = React.forwardRef<HTMLButtonElement, CollapseTriggerProps>(
  ({ className, children, isOpen, onToggle, icon, iconPosition = "end", ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-expanded={isOpen === true}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 px-5 py-4",
        "text-ds-md font-medium text-foreground text-left",
        "transition-colors duration-fast ease-smooth",
        "hover:bg-accent/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      {iconPosition === "start" && icon && (
        <span className="shrink-0 text-muted-foreground">{icon}</span>
      )}
      <span className="flex-1">{children}</span>
      {iconPosition === "end" && icon ? (
        <span className={cn(
          "shrink-0 text-muted-foreground transition-transform duration-normal ease-smooth",
          isOpen && "rotate-180"
        )}>
          {icon}
        </span>
      ) : (
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-normal ease-smooth",
            isOpen && "rotate-180"
          )}
          aria-hidden
        />
      )}
    </button>
  )
);
CollapseTrigger.displayName = "CollapseTrigger";

/* ── CollapseContent ─────────────────────────────────────── */
interface CollapseContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

const CollapseContent = React.forwardRef<HTMLDivElement, CollapseContentProps>(
  ({ className, children, isOpen, ...props }, ref) => (
    /* CSS grid-rows trick: animates from 0fr → 1fr with no inline styles */
    <div
      ref={ref}
      className={cn(
        "grid transition-[grid-template-rows] duration-normal ease-smooth",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div className="px-5 pb-4 pt-0 text-ds-md text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
);
CollapseContent.displayName = "CollapseContent";

export { CollapseGroup, Collapse, CollapseTrigger, CollapseContent, collapseVariants };
