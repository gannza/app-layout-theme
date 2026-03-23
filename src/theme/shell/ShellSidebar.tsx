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
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useShellConfig } from "./ShellContext";
import { ShellLinkComponentProps, ShellMenuItem } from "./types";
import { useMemo, useState, useEffect, ComponentType } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ShellInstitutionSelector } from "./ShellInstitutionSelector";

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
        className={({ isActive }) => {
          const isSubmenuLink = className?.includes("submenu-link");
          const topLevelBase =
            "rounded-md px-2 py-2";
          const submenuBase =
            "rounded-none px-2 py-2";
          const topLevelHover =
            "hover:bg-[#e9f2fe] hover:text-[#1868db] hover:shadow-[inset_2px_0_0_0_rgba(24,104,219,0.9)] hover:pl-[11px] dark:hover:bg-blue-500/10 dark:hover:text-[var(--ds-link,#669DF1)]";
          const topLevelActive =
            "bg-[#e9f2fe] text-[#1868db] shadow-[inset_2px_0_0_0_rgba(24,104,219,0.95)] pl-[11px] dark:bg-blue-500/10 dark:text-[var(--ds-link,#669DF1)] dark:shadow-[inset_2px_0_0_0_rgba(102,157,241,0.95)]";
          const submenuHover =
            "hover:bg-transparent hover:text-blue-700 dark:hover:text-[var(--ds-link,#669DF1)]";
          const submenuActive =
            "bg-transparent shadow-none text-blue-700 dark:text-[var(--ds-link,#669DF1)]";

          return cn(
            "flex items-center gap-3 text-sm font-medium transition-colors w-full",
            isSubmenuLink ? submenuBase : topLevelBase,
            isActive
              ? isSubmenuLink
                ? submenuActive
                : topLevelActive
              : isSubmenuLink
                ? `text-slate-600 dark:text-[var(--ds-text,#CECFD2)]/80 ${submenuHover}`
                : `text-slate-600 dark:text-[var(--ds-text,#CECFD2)]/80 ${topLevelHover}`,
            className
          );
        }}
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
        "flex items-center gap-3 text-sm font-medium transition-colors w-full text-slate-600 dark:text-[var(--ds-text,#CECFD2)]/80",
        className?.includes("submenu-link")
          ? "rounded-none px-2 py-2 hover:bg-transparent hover:text-blue-700 dark:hover:text-[var(--ds-link,#669DF1)]"
          : "rounded-md px-2 py-2 hover:bg-[#e9f2fe] hover:text-[#1868db] hover:shadow-[inset_2px_0_0_0_rgba(24,104,219,0.9)] hover:pl-[11px] dark:hover:bg-blue-500/10 dark:hover:text-[var(--ds-link,#669DF1)]",
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
    themeMode,
  } = useShellConfig();
  const { state, setOpenMobile, isMobile } = useSidebar();
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

  const footerBorder =
    themeMode === "dark" ? "border-slate-800" : "border-slate-200";

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      // Approximate ds-surface / ds-text from your Atlassian-like palette.
      root.style.setProperty("--sidebar", "rgb(31 31 33)"); // #1F1F21
      root.style.setProperty("--sidebar-foreground", "rgb(206 207 210)"); // #CECFD2
      root.style.setProperty(
        "--sidebar-accent",
        "rgba(102, 157, 241, 0.18)" // ds-link with alpha
      );
      root.style.setProperty("--sidebar-accent-foreground", "rgb(206 207 210)");
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
          ? "border-[var(--ds-border,#E3E4F21F)] bg-[var(--ds-surface,#1F1F21)]"
          : "border-slate-100 bg-white"
      )}
    >
      <SidebarHeader
        className={cn("bg-white dark:bg-[var(--ds-surface,#1F1F21)]")}
      >
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
          {(isMobile || state === "expanded") && (
            <SidebarMenuItem className="pt-2">
              <ShellInstitutionSelector forceShow block />
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent
        className={cn(
          "bg-white dark:bg-[var(--ds-surface,#1F1F21)] flex-1 flex flex-col"
        )}
      >
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

      {isMobile && (
        <SidebarFooter
          className={cn(
            "space-y-0 border-t pt-0 bg-white dark:bg-[var(--ds-surface,#1F1F21)]",
            footerBorder
          )}
        >
          {sidebarFooter}
        </SidebarFooter>
      )}
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

const isMenuBranchActive = (menu: ShellMenuItem, pathname: string): boolean => {
  if (menu.to && menu.to === pathname) return true;
  if (!menu.children?.length) return false;
  return menu.children.some((child) => isMenuBranchActive(child, pathname));
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
  const isActiveItem = !!item.to && item.to === location.pathname;
  const isActiveBranch = isMenuBranchActive(item, location.pathname);

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <SidebarMenuItem className={cn(depth > 0 && "-ml-[9px]")}>
          <SidebarMenuButton
            onClick={() => onToggle(item.id)}
            className={cn(
              "justify-between rounded-md",
              isActiveBranch &&
                "bg-[#e9f2fe] text-[#1868db] shadow-[inset_2px_0_0_0_rgba(24,104,219,0.95)] dark:bg-blue-500/10 dark:text-[var(--ds-link,#669DF1)] dark:shadow-[inset_2px_0_0_0_rgba(102,157,241,0.95)]"
            )}
          >
            <div className="flex items-center gap-3" style={{ paddingLeft }}>
              {item.icon &&
              (state !== "expanded" || depth === 0) ? (
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 text-current",
                    state === "expanded" ? "opacity-100" : "opacity-70"
                  )}
                />
              ) : null}
              {state === "expanded" && (
                <>
                  {depth > 0 && (
                    <span
                      className={cn(
                        "-ml-[10px] mr-2 inline-block w-[10px] shrink-0",
                        isActiveItem
                          ? "h-[2px] bg-[var(--ds-link,#669DF1)]"
                          : "h-px bg-slate-400 dark:bg-[var(--ds-text,#CECFD2)]/55"
                      )}
                      aria-hidden
                    />
                  )}
                  <span className="text-left">{item.label}</span>
                </>
              )}
            </div>
            {isOpen ? (
              <ChevronDown
                className={cn(
                  "h-4 w-4",
                  "text-[var(--ds-link,#669DF1)]"
                )}
              />
            ) : (
              <ChevronRight
                className={cn(
                  "h-4 w-4",
                  "text-[var(--ds-text,#CECFD2)]/60"
                )}
              />
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
        {isOpen && item.children?.length ? (
          <SidebarMenuSub
            className={cn(
              isActiveBranch
                ? "border-l-2 border-[var(--ds-link,#669DF1)]"
                : "border-l border-sidebar-border"
            )}
          >
            {item.children.map((child) => (
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
          </SidebarMenuSub>
        ) : null}
      </div>
    );
  }

  return (
    <SidebarMenuItem className={cn(depth > 0 && "-ml-[9px]")}>
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
          className={cn(
            state === "expanded" ? "" : "justify-center",
            depth > 0 && "submenu-link"
          )}
        >
          {item.icon && (
            (state !== "expanded" || depth === 0) ? (
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 text-current",
                  state === "expanded" ? "opacity-100" : "opacity-70"
                )}
              />
            ) : null
          )}
          {state === "expanded" && (
            <>
              {depth > 0 && (
                <span
                  className={cn(
                    "-ml-[10px] mr-2 inline-block w-[10px] shrink-0",
                    isActiveItem
                      ? "h-[2px] bg-[var(--ds-link,#669DF1)]"
                      : "h-px bg-slate-400 dark:bg-[var(--ds-text,#CECFD2)]/55"
                  )}
                  aria-hidden
                />
              )}
              <span className="flex-1 text-left">{item.label}</span>
            </>
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

