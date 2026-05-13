import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppShellProps,
  ShellPaginationConfig,
  ShellThemeMode,
} from "./types";
import { ShellProvider } from "./ShellContext";
import { ShellSidebar } from "./ShellSidebar";
import { ShellTopBar } from "./ShellTopBar";
import { ShellPaginationFooter } from "./ShellPaginationFooter";
import { AuthProvider } from "../auth/AuthProvider";
import {
  useAuthUser,
  useAuthInstitutions,
  useSelectedInstitutionId,
  useSwitchInstitution,
  useAuthAppLauncherItems,
} from "../auth/hooks";

// ── Core shell (no auth awareness) ───────────────────────────────────────────

function AppShellCore({
  children,
  className,
  pagination,
  footer,
  footerContent,
  showFooter = true,
  theme,
  // auth-derived overrides (injected by AppShellWithAuth)
  user: userProp,
  institutions: institutionsProp,
  selectedInstitutionId: selectedIdProp,
  onInstitutionChange: onInstitutionChangeProp,
  ...config
}: Omit<AppShellProps, "ssoBaseUrl" | "serviceName" | "signingSecret" | "clientId" | "encryptionEnabled"> & {
  user?: AppShellProps["user"];
  institutions?: AppShellProps["institutions"];
  selectedInstitutionId?: AppShellProps["selectedInstitutionId"];
  onInstitutionChange?: AppShellProps["onInstitutionChange"];
}) {
  const [themeMode, setThemeMode] = useState<ShellThemeMode>(
    theme?.initialMode ?? "light"
  );
  const [paginationState, setPaginationState] = useState<
    ShellPaginationConfig | null
  >(pagination ?? null);

  useEffect(() => {
    setPaginationState(pagination ?? null);
  }, [pagination]);

  const toggleTheme = useCallback(
    () =>
      setThemeMode((prev) =>
        prev === "light" ? "dark" : prev === "dark" ? "white" : "light"
      ),
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
      ? "bg-[var(--ds-surface,#1F1F21)] text-[var(--ds-text,#CECFD2)]"
      : themeMode === "white"
      ? "bg-white text-[var(--ds-text,#172b4d)]"
      : "bg-[#f0f2f5] text-[var(--ds-text,#172b4d)]";

  const providerValue = useMemo(
    () => ({
      ...config,
      user: userProp,
      institutions: institutionsProp,
      selectedInstitutionId: selectedIdProp,
      onInstitutionChange: onInstitutionChangeProp,
      footer,
      footerContent,
      showFooter,
      pagination: paginationState ?? undefined,
      setPagination: setPaginationState,
      themeMode,
      setThemeMode,
      toggleTheme,
    }),
    [
      config,
      userProp,
      institutionsProp,
      selectedIdProp,
      onInstitutionChangeProp,
      footer,
      footerContent,
      showFooter,
      paginationState,
      themeMode,
      toggleTheme,
    ]
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
                <div className="flex-1 overflow-y-auto px-3 py-5 sm:px-6 lg:px-8 w-full">
                  {children}
                </div>
                {paginationState && (
                  <ShellPaginationFooter
                    page={paginationState.page}
                    totalPages={paginationState.totalPages}
                    onChange={paginationState.onChange}
                    pageSize={paginationState.pageSize}
                    pageSizeOptions={paginationState.pageSizeOptions}
                    onPageSizeChange={paginationState.onPageSizeChange}
                    totalItems={paginationState.totalItems}
                    label={paginationState.label}
                    showNumbers={paginationState.showNumbers}
                    isLoading={paginationState.isLoading}
                  />
                )}
              </div>

              {showFooter && (
                <div
                  className={cn(
                    "border-t",
                    themeMode === "dark"
                      ? "border-[var(--ds-border,#E3E4F21F)] bg-[var(--ds-surface,#1F1F21)] text-[var(--ds-text,#CECFD2)]/60"
                      : "border-slate-200 bg-white text-slate-400"
                  )}
                >
                  {footerContent ?? (
                    <footer className="text-xs text-center py-2.5 tracking-wide">
                      © 2025 Government of Rwanda – IPPIS &nbsp;·&nbsp;{" "}
                      <a
                        href="#"
                        className={cn(
                          "hover:underline",
                          themeMode === "dark"
                            ? "text-[var(--ds-link,#669DF1)]"
                            : "text-[#3725c7]"
                        )}
                      >
                        Privacy
                      </a>{" "}
                      &nbsp;·&nbsp;{" "}
                      <a
                        href="#"
                        className={cn(
                          "hover:underline",
                          themeMode === "dark"
                            ? "text-[var(--ds-link,#669DF1)]"
                            : "text-[#3725c7]"
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
}

// ── Auth-aware wrapper (reads from AuthProvider context) ──────────────────────

function AppShellWithAuth(props: AppShellProps) {
  const authUser = useAuthUser();
  const authInstitutions = useAuthInstitutions();
  const authSelectedId = useSelectedInstitutionId();
  const switchInstitution = useSwitchInstitution();
  const authModules = useAuthAppLauncherItems();

  return (
    <AppShellCore
      {...props}
      // Auth-derived values take priority over manually provided props
      user={authUser ?? props.user}
      institutions={
        authInstitutions.length > 0 ? authInstitutions : props.institutions
      }
      selectedInstitutionId={authSelectedId ?? props.selectedInstitutionId}
      onInstitutionChange={(id) => {
        switchInstitution(id);
        props.onInstitutionChange?.(id);
      }}
      appLauncherItems={
        authModules.length > 0 ? authModules : props.appLauncherItems
      }
    />
  );
}

// ── Public export ─────────────────────────────────────────────────────────────

export const AppShell = ({
  ssoBaseUrl,
  serviceName,
  signingSecret,
  clientId,
  encryptionEnabled,
  onAuthChange,
  moduleIconBaseUrl,
  splashLogoUrl,
  ...rest
}: AppShellProps) => {
  if (ssoBaseUrl && serviceName) {
    return (
      <AuthProvider
        ssoBaseUrl={ssoBaseUrl}
        serviceName={serviceName}
        signingSecret={signingSecret}
        clientId={clientId}
        encryptionEnabled={encryptionEnabled}
        onAuthChange={onAuthChange}
        moduleIconBaseUrl={moduleIconBaseUrl}
        splashLogoUrl={splashLogoUrl}
      >
        <AppShellWithAuth
          ssoBaseUrl={ssoBaseUrl}
          serviceName={serviceName}
          {...rest}
        />
      </AuthProvider>
    );
  }

  return <AppShellCore {...rest} />;
};
