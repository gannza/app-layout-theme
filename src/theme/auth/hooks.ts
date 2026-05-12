import { useContext } from 'react';
import { AuthDataContext } from './AuthProvider';

/** Returns the full auth context. Must be used inside <AuthProvider>. */
export function useAuthData() {
  return useContext(AuthDataContext);
}

/** Mapped ShellUser from verify-me (null when not yet loaded or no auth). */
export function useAuthUser() {
  return useAuthData()?.user ?? null;
}

/** List of ShellInstitution objects mapped from assignedEntitySectors. */
export function useAuthInstitutions() {
  return useAuthData()?.institutions ?? [];
}

/** ID of the currently selected entity sector. */
export function useSelectedInstitutionId() {
  return useAuthData()?.selectedInstitutionId ?? null;
}

/** Raw VerifyMeResponse (full SSO user object). */
export function useRawSsoUser() {
  return useAuthData()?.raw ?? null;
}

/** Returns true while the initial verify-me request is in-flight. */
export function useAuthLoading() {
  return useAuthData()?.isLoading ?? false;
}

/** Logout callback — calls /auth/logout then redirects to SSO. */
export function useSsoLogout() {
  return useAuthData()?.onLogout ?? (() => {});
}

/** Institution switch callback — calls /auth/switch-entity-sector. */
export function useSwitchInstitution() {
  return useAuthData()?.onSwitchInstitution ?? ((_: string) => {});
}

/** AppLauncherItems derived from the selected entity sector's active modules. */
export function useAuthAppLauncherItems() {
  return useAuthData()?.appLauncherItems ?? [];
}
