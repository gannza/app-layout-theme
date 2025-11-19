import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useShellConfig } from "./ShellContext";
import { ShellLinkComponentProps, ShellMenuItem } from "./types";
import { useMemo, useState, useEffect, ComponentType } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor } from "./avatarColors";

const DefaultLink = ({
  to,
  href,
  className,
  children,
  onClick,
}: ShellLinkComponentProps) => {
  if (to) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 text-sm font-medium transition-colors w-full rounded-md px-2 py-2",
            isActive
              ? "bg-blue-50 text-blue-700 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)] dark:bg-blue-500/10 dark:text-blue-200"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
            className
          )
        }
        onClick={onClick}
      >
        {children}
      </NavLink>
    );
  }

  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 text-sm font-medium transition-colors w-full rounded-md px-2 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
        className
      )}
      onClick={onClick}
      data-collapsible="offcanvas"
      data-variant="sidebar"
    >
      {children}
    </a>
  );
};

export const ShellSidebar = () => {
  const {
    menus,
    sidebarFooter,
    sidebarHeader,
    linkComponent,
    onMenuSelect,
    user,
    themeMode,
  } = useShellConfig();
  const userAvatarColors = user ? getAvatarColor(user.name) : null;
  const { state, setOpenMobile } = useSidebar();
  const location = useLocation();
  const LinkComponent = linkComponent ?? DefaultLink;
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const flattenedMenus = useMemo(() => menus, [menus]);
  const getIsOpen = (id: string, depth: number) => {
    if (openMap[id] === undefined) {
      return depth === 0;
    }
    return openMap[id];
  };

  const borderClass =
    themeMode === "dark" ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white";
  const footerBorder =
    themeMode === "dark" ? "border-slate-800" : "border-slate-200";

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.style.setProperty("--sidebar", "rgb(2 6 23)");
      root.style.setProperty("--sidebar-foreground", "rgb(226 232 240)");
      root.style.setProperty("--sidebar-accent", "rgba(148, 163, 184, 0.2)");
      root.style.setProperty("--sidebar-accent-foreground", "rgb(226 232 240)");
    } else {
      root.style.setProperty("--sidebar", "rgb(255 255 255)");
      root.style.setProperty("--sidebar-foreground", "rgb(15 23 42)");
      root.style.setProperty("--sidebar-accent", "rgba(59, 130, 246, 0.12)");
      root.style.setProperty("--sidebar-accent-foreground", "rgb(15 23 42)");
    }
    return () => {
      root.style.removeProperty("--sidebar");
      root.style.removeProperty("--sidebar-foreground");
      root.style.removeProperty("--sidebar-accent");
      root.style.removeProperty("--sidebar-accent-foreground");
    };
  }, [themeMode]);

  return (
    <Sidebar
      collapsible="offcanvas"
      className={cn(
        "border-r",
        themeMode === "dark"
          ? "border-slate-900 bg-slate-950"
          : "border-slate-100 bg-white"
      )}
    >
      <SidebarHeader className={cn("bg-white dark:bg-slate-900")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {sidebarHeader ? (
                sidebarHeader
              ) : (
                <span className="font-semibold text-base text-slate-900">
                  Navigation
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className={cn("bg-white dark:bg-slate-900 flex-1 flex flex-col")}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 space-y-1">
              {flattenedMenus.map((item) => (
                <MenuNode
                  key={item.id}
                  item={item}
                  depth={0}
                  state={state}
                  LinkComponent={LinkComponent}
                  onItemSelect={(menu) => {
                    menu.onSelect?.();
                    onMenuSelect?.(menu);
                  }}
                  isOpen={getIsOpen(item.id, 0)}
                  getIsOpen={getIsOpen}
                  onToggle={toggleSection}
                  setOpenMobile={setOpenMobile}
                  location={location}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          "space-y-3 border-t pt-3 bg-white dark:bg-slate-900",
          footerBorder
        )}
      >
        {user && state === "expanded" && userAvatarColors && (
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2 shadow-sm border border-blue-500/40",
              themeMode === "dark" ? "bg-slate-900" : "bg-white"
            )}
          >
            <Avatar className="h-9 w-9 border border-blue-500/40">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              )}
              <AvatarFallback
                className={cn(
                  "text-sm font-semibold flex items-center justify-center w-full h-full rounded-full",
                  userAvatarColors.bg,
                  userAvatarColors.text
                )}
              >
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate">{user.name}</span>
              {user.email && (
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </span>
              )}
            </div>
          </div>
        )}

        {sidebarFooter}
      </SidebarFooter>
    </Sidebar>
  );
};

type MenuNodeProps = {
  item: ShellMenuItem;
  depth: number;
  state: "collapsed" | "expanded";
  LinkComponent: ComponentType<ShellLinkComponentProps>;
  onItemSelect: (item: ShellMenuItem) => void;
  isOpen: boolean;
  onToggle: (id: string) => void;
  getIsOpen: (id: string, depth: number) => boolean;
  setOpenMobile: (open: boolean) => void;
  location: ReturnType<typeof useLocation>;
};

const MenuNode = ({
  item,
  depth,
  state,
  LinkComponent,
  onItemSelect,
  isOpen,
  onToggle,
  getIsOpen,
  setOpenMobile,
  location,
}: MenuNodeProps) => {
  const hasChildren = !!item.children?.length;
  const paddingLeft = state === "expanded" ? `${depth * 0.75}rem` : "0";

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => onToggle(item.id)}
            className="justify-between"
          >
            <div className="flex items-center gap-3" style={{ paddingLeft }}>
              {item.icon && (
                <item.icon className="h-4 w-4 shrink-0 text-current opacity-70" />
              )}
              {state === "expanded" && (
                <span className="text-left">{item.label}</span>
              )}
            </div>
            {state === "expanded" &&
              (isOpen ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              ))}
          </SidebarMenuButton>
        </SidebarMenuItem>
        {isOpen &&
          item.children?.map((child) => (
            <MenuNode
              key={child.id}
              item={child}
              depth={depth + 1}
              state={state}
              LinkComponent={LinkComponent}
              onItemSelect={onItemSelect}
              isOpen={getIsOpen(child.id, depth + 1)}
              getIsOpen={getIsOpen}
              onToggle={onToggle}
              setOpenMobile={setOpenMobile}
              location={location}
            />
          ))}
      </div>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        disabled={item.disabled}
        className="focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:bg-blue-50 focus-visible:text-blue-600 dark:focus-visible:bg-blue-500/10 dark:focus-visible:text-blue-200"
      >
        <LinkComponent
          to={item.to}
          href={item.href}
          onClick={(event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
          if (item.to && location.pathname === item.to) {
            event.preventDefault();
            setOpenMobile(false);
            return;
          }
          onItemSelect(item);
          setOpenMobile(false);
          }}
          className={cn(state === "expanded" ? "" : "justify-center")}
        >
          {item.icon && (
            <item.icon className="h-4 w-4 shrink-0 text-current opacity-70" />
          )}
          {state === "expanded" && (
            <span
              className="flex-1 text-left"
              style={{ paddingLeft }}
            >
              {item.label}
            </span>
          )}
          {state === "expanded" && item.badge && (
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {item.badge}
            </span>
          )}
        </LinkComponent>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

