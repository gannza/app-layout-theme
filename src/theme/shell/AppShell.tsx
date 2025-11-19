import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShellProps, ShellThemeMode } from "./types";
import { ShellProvider } from "./ShellContext";
import { ShellSidebar } from "./ShellSidebar";
import { ShellTopBar } from "./ShellTopBar";
import { ShellPaginationFooter } from "./ShellPaginationFooter";

export const AppShell = ({
  children,
  className,
  pagination,
  footer,
  footerContent,
  showFooter = true,
  theme,
  ...config
}: AppShellProps) => {
  const [themeMode, setThemeMode] = useState<ShellThemeMode>(
    theme?.initialMode ?? "light"
  );

  const toggleTheme = useCallback(
    () => setThemeMode((prev) => (prev === "light" ? "dark" : "light")),
    []
  );

  useEffect(() => {
    theme?.onModeChange?.(themeMode);
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    return () => {
      root.classList.remove("dark");
    };
  }, [themeMode, theme]);

  const shellBackground =
    themeMode === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-[#f5f6fb] text-slate-900";

  const providerValue = useMemo(
    () => ({
      ...config,
      footer,
      footerContent,
      showFooter,
      themeMode,
      setThemeMode,
      toggleTheme,
    }),
    [config, footer, footerContent, showFooter, themeMode, toggleTheme]
  );

  return (
    <ShellProvider value={providerValue}>
      <SidebarProvider>
        <div
          className={cn(
            "h-screen w-full overflow-hidden",
            shellBackground,
            className
          )}
        >
          <div className="flex h-full w-full">
            <ShellSidebar />

            <SidebarInset className="flex flex-col bg-transparent p-0">
              <ShellTopBar />

              <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 lg:px-10 w-full">
                  {children}
                </div>
                {pagination && (
                  <ShellPaginationFooter
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    onChange={pagination.onChange}
                  />
                )}
              </div>

              {showFooter && (
                <div
                  className={cn(
                    "border-t",
                    themeMode === "dark"
                      ? "border-slate-800 bg-slate-950 text-slate-400"
                      : "border-slate-200 bg-white text-slate-600"
                  )}
                >
                  {footerContent ?? (
                    <footer className="text-sm text-center py-3">
                      © 2025 Government of Rwanda – IPPIS |{" "}
                      <a
                        href="#"
                        className={cn(
                          "hover:underline",
                          themeMode === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        )}
                      >
                        Privacy
                      </a>{" "}
                      |{" "}
                      <a
                        href="#"
                        className={cn(
                          "hover:underline",
                          themeMode === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        )}
                      >
                        Terms
                      </a>
                    </footer>
                  )}
                </div>
              )}
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </ShellProvider>
  );
};
