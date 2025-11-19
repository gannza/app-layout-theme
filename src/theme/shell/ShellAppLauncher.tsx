import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useShellConfig } from "./ShellContext";
import { Grip } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLauncherItem } from "./types";

export const ShellAppLauncher = () => {
  const { appLauncherItems, themeMode } = useShellConfig();

  const apps = useMemo(() => appLauncherItems ?? [], [appLauncherItems]);
  if (!apps.length) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="IPPIS Modules"
          className={cn(
            "h-10 w-10 rounded-full border",
            themeMode === "dark"
              ? "border-slate-700 dark:hover:bg-slate-800"
              : "border-slate-200 hover:bg-slate-100 hover:text-blue-500"
          )}
        >
          <Grip className="h-5 w-5 text-slate-600 hover:text-blue-500 dark:text-slate-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 sm:w-80" align="end">
        <div className="grid grid-cols-3 gap-3">
          {apps.map((item) => (
            <AppLauncherCard key={item.id} item={item} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const AppLauncherCard = ({ item }: { item: AppLauncherItem }) => {
  const content = (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-transparent hover:border-blue-500/40 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-3 text-center cursor-pointer transition-colors"
      onClick={() => item.onSelect?.()}
    >
      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
        {item.icon ? (
          <item.icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        ) : (
          <Grip className="h-5 w-5 text-slate-500" />
        )}
      </div>
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
        {item.label}
      </span>
      {item.description && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {item.description}
        </span>
      )}
    </div>
  );

  if (item.href) {
    return (
      <a href={item.href} onClick={item.onSelect} className="no-underline">
        {content}
      </a>
    );
  }

  return content;
};

