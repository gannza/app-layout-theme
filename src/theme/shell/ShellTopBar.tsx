import { cn } from "@/lib/utils";
import { ShellSearch } from "./ShellSearch";
import { useShellConfig } from "./ShellContext";
import { ShellThemeToggle } from "./ShellThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ShellAppLauncher } from "./ShellAppLauncher";
import { ShellInstitutionSelector } from "./ShellInstitutionSelector";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { ShellQuickActions } from "./ShellQuickActions";
import { ShellUserMenu } from "./ShellUserMenu";

export const ShellTopBar = () => {
  const { actions, user, themeMode, search, showSearch } = useShellConfig();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const borderColor =
    themeMode === "dark"
      ? "border-slate-800 bg-slate-900/85"
      : "border-slate-100 bg-white";

  const shouldShowSearch = showSearch !== false && !!search;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b shadow-sm",
        borderColor
      )}
    >
      <div className="w-full px-3 py-3 sm:px-6 lg:px-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        <div className="flex items-center gap-3 w-full md:max-w-2xl">
          <SidebarTrigger className="h-9 w-9 rounded-full hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800" />
          <ShellInstitutionSelector />
          {shouldShowSearch && (
            <>
              <div
                className={cn(
                  "hidden md:block flex-1 md:min-w-[240px]",
                  mobileSearchOpen && "md:block"
                )}
              >
              <ShellSearch />
            </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="md:hidden rounded-full border border-slate-200 dark:border-slate-700"
                onClick={() => setMobileSearchOpen((prev) => !prev)}
              >
                {mobileSearchOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>

        {shouldShowSearch && mobileSearchOpen && (
          <div className="md:hidden">
            <ShellSearch />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap md:gap-3 ml-auto">
          <ShellAppLauncher />
          <ShellQuickActions />
          {actions}
          <ShellThemeToggle />
          {user && <ShellUserMenu />}
        </div>
      </div>
    </header>
  );
};
