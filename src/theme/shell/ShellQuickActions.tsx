import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useShellConfig } from "./ShellContext";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ShellQuickActions = () => {
  const { quickActions, themeMode } = useShellConfig();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const actionMap = useMemo(() => {
    if (!quickActions?.length) return null;
    return quickActions.reduce<Record<string, (typeof quickActions)[number]>>(
      (acc, action) => ({ ...acc, [action.id]: action }),
      {}
    );
  }, [quickActions]);

  if (!quickActions?.length || !actionMap) return null;

  const currentPanel = activeAction ? actionMap[activeAction]?.panel : null;

  return (
    <>
      <div className="flex items-center gap-1">
        {quickActions.map((action) => (
          <Tooltip delayDuration={150} key={action.id}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full border [&_svg]:size-4",
                  themeMode === "dark"
                    ? "border-slate-700 hover:bg-slate-800"
                    : "border-slate-200 hover:bg-slate-100"
                )}
                onClick={() => {
                  if (action.panel) {
                    setActiveAction(action.id);
                  }
                  action.onSelect?.();
                }}
              >
                <action.icon className="h-4 w-4 text-slate-600 dark:text-slate-200" />
              </Button>
            </TooltipTrigger>
            {action.tooltip && (
              <TooltipContent>{action.tooltip}</TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>

      <Sheet
        open={Boolean(activeAction && currentPanel)}
        onOpenChange={(open) => {
          if (!open) setActiveAction(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-md border-l" side="right">
          <SheetHeader>
            <SheetTitle>
              {activeAction ? actionMap[activeAction]?.label : ""}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">{currentPanel}</div>
        </SheetContent>
      </Sheet>
    </>
  );
};

