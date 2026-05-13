import React, { useState, type ReactNode } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Building2, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import type { SsoAuthApi } from './authApi';
import { clearUser, setUser } from './authSlice';
import { SplashScreen } from './SplashScreen';
import { createAuthStore } from './store';
import type { AuthChangePayload, AssignedEntitySector, SsoAuthConfig, VerifyMeResponse } from './types';
import {
  mapEntitySectorToInstitution,
  mapVerifyMeToUser,
  redirectToLogin,
} from './utils';
import { resolveModuleIcon } from './iconMap';
import type { AppLauncherItem, ShellInstitution, ShellUser } from '../shell/types';

// ── Context ───────────────────────────────────────────────────────────────────

export interface AuthData {
  user: ShellUser | null;
  institutions: ShellInstitution[];
  selectedInstitutionId: string | null;
  appLauncherItems: AppLauncherItem[];
  raw: VerifyMeResponse | null;
  isLoading: boolean;
  onLogout: () => void;
  onSwitchInstitution: (id: string) => void;
}

export const AuthDataContext = React.createContext<AuthData | null>(null);

// ── Select-institution modal ──────────────────────────────────────────────────

interface SelectInstitutionModalProps {
  sectors: AssignedEntitySector[];
  onSelect: (id: string) => void;
  isSwitching: boolean;
}

function SelectInstitutionModal({
  sectors,
  onSelect,
  isSwitching,
}: SelectInstitutionModalProps) {
  return (
    <Dialog open>
      <DialogContent
        size="md"
        hideClose
        // Prevent accidental dismissal — user must pick an institution
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader variant="primary" divider>
          <DialogTitle>Select Workspace</DialogTitle>
          <DialogDescription>
            Choose the institution you want to work in for this session.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="p-3">
          {isSwitching ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Spinner size="lg" />
              <p className="text-ds-sm text-muted-foreground">Switching workspace…</p>
            </div>
          ) : (
            <ul className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
              {sectors.map((sector) => (
                <li key={sector.id}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-colors flex items-start gap-3 group"
                    onClick={() => onSelect(sector.id)}
                    disabled={isSwitching}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                        ${sector.isLocked
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                        }`}
                    >
                      {sector.isLocked
                        ? <Lock className="h-4 w-4" />
                        : <Building2 className="h-4 w-4" />
                      }
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-ds-sm font-medium text-foreground truncate leading-tight">
                        {sector.name}
                      </p>
                      <p className="text-ds-xs text-muted-foreground mt-0.5">
                        {sector.sector}
                        {sector.isLocked && (
                          <span className="ml-2 inline-flex items-center gap-0.5 text-warning-foreground">
                            · Locked
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

// ── Inner component (has access to the local store) ───────────────────────────

interface AuthInitProps {
  api: SsoAuthApi;
  ssoBaseUrl: string;
  serviceName: string;
  moduleIconBaseUrl?: string;
  splashLogoUrl?: string;
  onAuthChange?: (payload: AuthChangePayload) => void;
  children: ReactNode;
}

function AuthInit({ api, ssoBaseUrl, serviceName, moduleIconBaseUrl, splashLogoUrl, onAuthChange, children }: AuthInitProps) {
  const dispatch = useDispatch();
  const { data, isLoading, error } = api.useVerifyMeQuery();
  const [logoutMutation] = api.useLogoutMutation();
  // One redirect per page-load — useRef resets on fresh mount after navigation
  const hasRedirected = React.useRef(false);
  const [switchEntitySectorMutation, { isLoading: isSwitching }] =
    api.useSwitchEntitySectorMutation();

  // Redirect to SSO only when verify-me definitively fails with 401
  React.useEffect(() => {
    if (!isLoading && error && (error as { status?: number }).status === 401 && !hasRedirected.current) {
      hasRedirected.current = true;
      dispatch(clearUser());
      redirectToLogin(ssoBaseUrl, serviceName);
    }
  }, [isLoading, error, dispatch, ssoBaseUrl, serviceName]);

  // Sync verify-me result into redux slice
  React.useEffect(() => {
    if (data) dispatch(setUser(data));
  }, [data, dispatch]);

  // Fire onAuthChange whenever the resolved user data changes
  React.useEffect(() => {
    if (!data || !onAuthChange) return;
    onAuthChange({
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      selectedEntitySector: data.selectedEntitySector,
    });
  }, [data, onAuthChange]);

  const handleLogout = React.useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // still redirect even if the API call fails
    }
    dispatch(clearUser());
    redirectToLogin(ssoBaseUrl, serviceName);
  }, [logoutMutation, dispatch, ssoBaseUrl, serviceName]);

  const handleSwitchInstitution = React.useCallback(
    async (id: string) => {
      try {
        await switchEntitySectorMutation(id).unwrap();
        // invalidatesTags: ['Auth'] triggers verifyMe refetch with full data
      } catch {
        // mutation failed — verifyMe cache is unchanged, modal stays open
      }
    },
    [switchEntitySectorMutation],
  );

  const sectors = data?.assignedEntitySectors ?? [];

  const appLauncherItems = React.useMemo<AppLauncherItem[]>(() => {
    const modules =
      data?.selectedEntitySector?.selectedBudgetEntity?.[0]?.modules ?? [];
    const iconBase = moduleIconBaseUrl
      ? moduleIconBaseUrl.replace(/\/?$/, '/')
      : ssoBaseUrl.replace(/\/?$/, '/');
    return [...modules]
      .sort((a, b) => a.orderNo - b.orderNo)
      .filter((m) => m.isActive)
      .map((m) => ({
        id: m.moduleId,
        label: m.fullName,
        // Prefer bundled local asset; fall back to remote URL
        icon: m.icon
          ? (resolveModuleIcon(m.icon) ?? `${iconBase}${m.icon}`)
          : undefined,
        href: m.to,
      }));
  }, [data?.selectedEntitySector, ssoBaseUrl, moduleIconBaseUrl]);

  const authData: AuthData = React.useMemo(
    () => ({
      raw: data ?? null,
      isLoading,
      user: data ? mapVerifyMeToUser(data, handleLogout) : null,
      institutions: sectors.map(mapEntitySectorToInstitution),
      selectedInstitutionId: data?.selectedEntitySector?.id ?? null,
      appLauncherItems,
      onLogout: handleLogout,
      onSwitchInstitution: handleSwitchInstitution,
    }),
    [data, isLoading, sectors, appLauncherItems, handleLogout, handleSwitchInstitution],
  );

  // Show institution picker if verify-me resolved but no sector is selected yet
  const needsSectorSelection =
    !isLoading &&
    data !== undefined &&
    data.selectedEntitySector === null &&
    sectors.length > 0;

  // Show splash while verify-me is in flight
  if (isLoading) {
    return (
      <AuthDataContext.Provider value={authData}>
        <SplashScreen logoUrl={splashLogoUrl} />
      </AuthDataContext.Provider>
    );
  }

  return (
    <AuthDataContext.Provider value={authData}>
      {needsSectorSelection && (
        <SelectInstitutionModal
          sectors={data!.assignedEntitySectors}
          onSelect={handleSwitchInstitution}
          isSwitching={isSwitching}
        />
      )}
      {children}
    </AuthDataContext.Provider>
  );
}

// ── Public provider ───────────────────────────────────────────────────────────

export type AuthProviderProps = SsoAuthConfig & {
  children: ReactNode;
  onAuthChange?: (payload: AuthChangePayload) => void;
  moduleIconBaseUrl?: string;
  splashLogoUrl?: string;
};

export function AuthProvider({
  ssoBaseUrl,
  serviceName,
  signingSecret,
  clientId,
  encryptionEnabled,
  onAuthChange,
  moduleIconBaseUrl,
  splashLogoUrl,
  children,
}: AuthProviderProps) {
  const resolvedSecret =
    signingSecret ?? (import.meta as unknown as Record<string, Record<string, string>>).env?.VITE_API_SIGNING_SECRET;
  const resolvedClientId =
    clientId ?? (import.meta as unknown as Record<string, Record<string, string>>).env?.VITE_APP_ID;
  const resolvedEncryption =
    encryptionEnabled ??
    ((import.meta as unknown as Record<string, Record<string, string>>).env?.VITE_API_ENCRYPTION_ENABLED === 'true');

  const signingConfig =
    resolvedSecret && resolvedClientId
      ? { signingSecret: resolvedSecret, clientId: resolvedClientId }
      : null;

  const [{ store, api }] = useState(() =>
    createAuthStore(ssoBaseUrl, signingConfig, resolvedEncryption),
  );

  return (
    <Provider store={store}>
      <AuthInit
        api={api}
        ssoBaseUrl={ssoBaseUrl}
        serviceName={serviceName}
        moduleIconBaseUrl={moduleIconBaseUrl}
        splashLogoUrl={splashLogoUrl}
        onAuthChange={onAuthChange}
      >
        {children}
      </AuthInit>
    </Provider>
  );
}
