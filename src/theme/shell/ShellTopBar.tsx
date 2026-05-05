import { cn } from "@/lib/utils";
import { ShellSearch } from "./ShellSearch";
import { useShellConfig } from "./ShellContext";
// import { ShellThemeToggle } from "./ShellThemeToggle";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

import { ShellAppLauncher } from "./ShellAppLauncher";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ShellQuickActions } from "./ShellQuickActions";
import { ShellUserMenu } from "./ShellUserMenu";

export const ShellTopBar = () => {
  const { actions, user, themeMode, search, showSearch } = useShellConfig();
  const { toggleSidebar, state } = useSidebar();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const borderColor =
    themeMode === "dark"
      ? "border-[var(--ds-border,#E3E4F21F)] bg-[var(--ds-surface,#1F1F21)]"
      : "border-slate-100 bg-white";

  const shouldShowSearch = showSearch !== false && !!search;

  return (
    <header
      className={cn("sticky top-0 z-40 w-full border-b", borderColor)}
    >
      <div className="w-full px-3 py-2 sm:px-6 lg:px-8 md:py-3 relative">
        {/* Floating toggle button for desktop, positioned over the left border */}
        <button
          onClick={toggleSidebar}
          className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-50 hidden md:flex h-7 w-7 items-center justify-center rounded-full bg-[#3725c7] text-white shadow-md hover:scale-105 transition-transform"
        >
          {state === "expanded" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {/* Mobile layout */}
        <div className="flex flex-col gap-2 md:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <SidebarTrigger className="h-8 w-8 rounded-full hover:bg-slate-100 hover:text-[#3725c7] dark:hover:bg-slate-800" />
              </div>
              {shouldShowSearch && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full border border-slate-200 dark:border-[var(--ds-surface-overlay,#2B2C2F)]"
                  onClick={() => setMobileSearchOpen((prev) => !prev)}
                >
                  {mobileSearchOpen ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    <Search className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ShellAppLauncher />
              <ShellQuickActions />
              {actions}
              {/* <ShellThemeToggle /> */}
              {user && <ShellUserMenu />}
            </div>
          </div>
          {shouldShowSearch && mobileSearchOpen && <ShellSearch />}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex w-full items-center gap-6">
          <div className="flex items-center gap-3 w-full md:max-w-2xl">
            {shouldShowSearch && (
              <div className="flex-1 md:min-w-[240px]">
                <ShellSearch />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <ShellAppLauncher />
            <ShellQuickActions />
            {actions}
            {/* <ShellThemeToggle /> */}
            {user && <ShellUserMenu />}
          </div>
        </div>
      </div>
    </header>
  );
};
