import {
  ComponentType,
  PropsWithChildren,
  createContext,
  useContext,
} from "react";
import {
  AppShellProps,
  ShellLinkComponentProps,
  ShellMenuItem,
  ShellSearchConfig,
  ShellThemeMode,
  ShellUser,
} from "./types";

export type ShellContextValue = Omit<AppShellProps, "children"> & {
  linkComponent?: ComponentType<ShellLinkComponentProps>;
  menus: ShellMenuItem[];
  search?: ShellSearchConfig;
  user?: ShellUser;
  themeMode: ShellThemeMode;
  setThemeMode: (mode: ShellThemeMode) => void;
  toggleTheme: () => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export const ShellProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: ShellContextValue }>) => {
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
};

export const useShellConfig = () => {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error("useShellConfig must be used within ShellProvider");
  }
  return ctx;
};

