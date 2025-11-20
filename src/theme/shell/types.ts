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
  icon?: ComponentType<{ className?: string }>;
  description?: string;
  href?: string;
  onSelect?: () => void;
};

export type ShellUser = {
  name: string;
  email?: string;
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

export type ShellThemeMode = "light" | "dark";

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
}

