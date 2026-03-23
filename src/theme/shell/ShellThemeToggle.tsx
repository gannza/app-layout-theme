import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShellConfig } from "./ShellContext";

export const ShellThemeToggle = () => {
  const { themeMode, toggleTheme } = useShellConfig();

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-full border border-slate-200 dark:border-[var(--ds-surface-overlay,#2B2C2F)] [&_svg]:size-4"
      title={`Switch to ${themeMode === "light" ? "dark" : "light"} mode`}
      aria-label="Toggle theme"
    >
      {themeMode === "light" ? (
        <Moon className="h-4 w-4 text-slate-600" />
      ) : (
        <Sun className="h-4 w-4 text-amber-300" />
      )}
    </Button>
  );
};

