import { ComponentType, ReactNode, MouseEvent } from "react";

export type ShellMenuItem = {
  id: string;
  label: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  to?: string;
  href?: string;
  onSelect?: () => void;
  badge?: ReactNode;
  disabled?: boolean;
  children?: ShellMenuItem[];
  meta?: Record<string, unknown>;
};

export type ShellSearchRenderProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

export type ShellSearchConfig = {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  debounceMs?: number;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  render?: (props: ShellSearchRenderProps) => ReactNode;
};

export type ShellUserMenuItem = {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  description?: string;
  href?: string;
  onSelect?: () => void;
  danger?: boolean;
};

export type QuickAction = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label?: string;
  tooltip?: string;
  onSelect?: () => void;
  panel?: ReactNode;
  variant?: "default" | "primary";
};

export type AppLauncherItem = {
  id: string;
  label: string;
  /** React component or image URL string */
  icon?: ComponentType<{ className?: string }> | string;
  description?: string;
  href?: string;
  onSelect?: () => void;
  openInNewTab?: boolean;
};

export type ShellUser = {
  name: string;
  email?: string;
  subtitle?: string;
  avatarUrl?: string;
  extras?: ReactNode;
  menuItems?: ShellUserMenuItem[];
};

export type ShellLinkComponentProps = {
  to?: string;
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};

export type ShellInstitution = {
  id: string;
  name: string;
  acronym: string;
};

export type ShellThemeMode = "light" | "dark" | "white";

export type ShellThemeOptions = {
  initialMode?: ShellThemeMode;
  onModeChange?: (mode: ShellThemeMode) => void;
};

export type ShellPaginationConfig = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  label?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  totalItems?: number;
  showNumbers?: boolean;
  isLoading?: boolean;
};

export interface AppShellProps {
  showSearch?: boolean;
  title?: string;
  subtitle?: string;
  logo?: ReactNode;
  sidebarHeader?: ReactNode;
  menus: ShellMenuItem[];
  search?: ShellSearchConfig;
  user?: ShellUser;
  footer?: ReactNode;
  showFooter?: boolean;
  footerContent?: ReactNode;
  actions?: ReactNode;
  quickActions?: QuickAction[];
  appLauncherItems?: AppLauncherItem[];
  /** Base URL prepended to module icon filenames from SSO (e.g. "/assets/icons/" or "https://sso.example.com/icons/"). Defaults to ssoBaseUrl. */
  moduleIconBaseUrl?: string;
  sidebarFooter?: ReactNode;
  institutions?: ShellInstitution[];
  selectedInstitutionId?: string;
  onInstitutionChange?: (institutionId: string) => void;
  institutionPlaceholder?: string;
  showInstitutionSelector?: boolean;
  pagination?: ShellPaginationConfig;
  theme?: ShellThemeOptions;
  children: ReactNode;
  className?: string;
  linkComponent?: ComponentType<ShellLinkComponentProps>;
  onMenuSelect?: (item: ShellMenuItem) => void;

  // ── SSO / Auth (optional) ─────────────────────────────────────────────────
  /**
   * Called whenever verify-me resolves (initial load + after institution switch).
   * Use this to receive the current user and selected entity sector in the consuming app.
   */
  onAuthChange?: (payload: import('../auth/types').AuthChangePayload) => void;
  /** Base URL of the SSO server. When provided, auth is handled automatically. */
  ssoBaseUrl?: string;
  /** Service name used in the SSO redirect URL, e.g. "Internship Portal" */
  serviceName?: string;
  /** HMAC signing secret (falls back to VITE_API_SIGNING_SECRET env var) */
  signingSecret?: string;
  /** App client ID (falls back to VITE_APP_ID env var) */
  clientId?: string;
  /** Enable pako decompression of SSO responses (falls back to VITE_API_ENCRYPTION_ENABLED) */
  encryptionEnabled?: boolean;
  /** URL of the logo shown on the splash screen during SSO auth initialization */
  splashLogoUrl?: string;
}

