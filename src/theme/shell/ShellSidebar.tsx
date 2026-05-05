import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as PopoverPrimitive from "@radix-ui/react-popover";
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
import { useMemo, useState, useEffect, useRef, ComponentType, forwardRef } from "react";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { ShellInstitutionSelector } from "./ShellInstitutionSelector";

/* ── Default link ────────────────────────────────────────── */
const DefaultLink = forwardRef<HTMLAnchorElement, ShellLinkComponentProps>(
  ({ to, href, className, children, onClick }, ref) => {
    if (to) {
      return (
        <NavLink
          ref={ref}
        to={to}
        className={({ isActive }) => {
          const isSubmenuLink = className?.includes("submenu-link");
          return cn(
            "flex items-center gap-3 text-[15px] font-medium transition-colors w-full",
            isSubmenuLink
              ? "rounded-none px-3 py-2.5"
              : "rounded-lg px-3 py-2.5",
            isActive
              ? isSubmenuLink
                ? "bg-transparent shadow-none text-[#3725c7] dark:text-[var(--ds-link,#669DF1)]"
                : "bg-[#ebe9f9] text-[#3725c7] shadow-[inset_2px_0_0_0_rgba(55,37,199,0.95)] pl-[11px] dark:bg-blue-500/10 dark:text-[var(--ds-link,#669DF1)] dark:shadow-[inset_2px_0_0_0_rgba(102,157,241,0.95)]"
              : isSubmenuLink
                ? "text-slate-600 dark:text-[var(--ds-text,#CECFD2)]/80 hover:bg-transparent hover:text-[#3725c7] dark:hover:text-[var(--ds-link,#669DF1)]"
                : "text-slate-600 dark:text-[var(--ds-text,#CECFD2)]/80 hover:bg-[#ebe9f9] hover:text-[#3725c7] hover:shadow-[inset_2px_0_0_0_rgba(55,37,199,0.9)] hover:pl-[11px] dark:hover:bg-[#ebe9f9] dark:hover:text-[var(--ds-link,#669DF1)]",
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
      ref={ref}
      href={href}
      className={cn(
        "flex items-center gap-3 text-[15px] font-medium transition-colors w-full text-slate-600 dark:text-[var(--ds-text,#CECFD2)]/80",
        className?.includes("submenu-link")
          ? "rounded-none px-3 py-2.5 hover:bg-transparent hover:text-[#3725c7] dark:hover:text-[var(--ds-link,#669DF1)]"
          : "rounded-lg px-3 py-2.5 hover:bg-[#ebe9f9] hover:text-[#3725c7] hover:shadow-[inset_2px_0_0_0_rgba(55,37,199,0.9)] hover:pl-[11px] dark:hover:bg-[#ebe9f9] dark:hover:text-[var(--ds-link,#669DF1)]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </a>
  );
});

/* ── Icon container used in collapsed rail ───────────────── */
const IconPill = ({
  icon: Icon,
  active,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  className?: string;
}) => (
  <span
    className={cn(
      "flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200",
      active
        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 dark:bg-emerald-600"
        : "text-slate-400 group-hover/iconbtn:bg-slate-100 group-hover/iconbtn:text-slate-600 dark:group-hover/iconbtn:bg-slate-800 dark:group-hover/iconbtn:text-slate-200",
      className
    )}
  >
    <Icon className={cn("shrink-0", active ? "h-5 w-5" : "h-[22px] w-[22px]")} />
  </span>
);

/* ── Hover popover for collapsed items with children ─────── */
const CollapsedSubmenuPopover = ({
  item,
  LinkComponent,
  onItemSelect,
  setOpenMobile,
  location,
}: {
  item: ShellMenuItem;
  LinkComponent: ComponentType<ShellLinkComponentProps>;
  onItemSelect: (item: ShellMenuItem) => void;
  setOpenMobile: (v: boolean) => void;
  location: ReturnType<typeof useLocation>;
}) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const isActiveBranch = isMenuBranchActive(item, location.pathname);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          onMouseEnter={show}
          onMouseLeave={hide}
          className="group/iconbtn flex w-full items-center justify-center py-0.5 focus:outline-none py-2 px-2"
          aria-label={item.label}
        >
          {item.icon ? (
            <IconPill icon={item.icon} active={isActiveBranch} />
          ) : (
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-colors",
                isActiveBranch
                  ? "bg-[#ebe9f9] text-[#3725c7] dark:bg-blue-500/15 dark:text-[var(--ds-link,#669DF1)]"
                  : "text-slate-400 group-hover/iconbtn:bg-[#ebe9f9]/70 group-hover/iconbtn:text-[#3725c7]"
              )}
            >
              {item.label.slice(0, 2)}
            </span>
          )}
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="right"
          align="start"
          sideOffset={8}
          onMouseEnter={show}
          onMouseLeave={hide}
          className={cn(
            "z-50 min-w-[180px] rounded-xl border border-border bg-popover p-1.5 shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "origin-[--radix-popover-content-transform-origin]"
          )}
        >
          {/* Parent label */}
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {item.label}
          </p>

          {item.children?.map((child) => {
            const isActive = !!child.to && child.to === location.pathname;
            return (
              <LinkComponent
                key={child.id}
                to={child.to}
                href={child.href}
                onClick={() => {
                  setOpen(false);
                  onItemSelect(child);
                  setOpenMobile(false);
                }}
                className={cn(
                  "flex items-center my-1 gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors w-full",
                  isActive
                    ? "bg-[#ebe9f9] text-[#3725c7] dark:bg-blue-500/10 dark:text-[var(--ds-link,#669DF1)]"
                    : "text-slate-600 dark:text-[var(--ds-text,#CECFD2)]/80 hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {child.icon && <child.icon className="h-4 w-4 shrink-0" />}
                {child.label}
              </LinkComponent>
            );
          })}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

/* ── Main shell sidebar ──────────────────────────────────── */
export const ShellSidebar = () => {
  const { menus, sidebarFooter, sidebarHeader, linkComponent, onMenuSelect, themeMode } =
    useShellConfig();
  const { state, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  const location = useLocation();
  const LinkComponent = linkComponent ?? DefaultLink;
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) =>
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));

  const flattenedMenus = useMemo(() => menus, [menus]);
  const getIsOpen = (id: string, depth: number) =>
    openMap[id] === undefined ? depth === 0 : openMap[id];

  const footerBorder = themeMode === "dark" ? "border-slate-800" : "border-slate-200";

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.style.setProperty("--sidebar", "rgb(31 31 33)");
      root.style.setProperty("--sidebar-foreground", "rgb(206 207 210)");
      root.style.setProperty("--sidebar-accent", "rgba(102, 157, 241, 0.18)");
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
      collapsible="icon"
      className={cn(
        "border-r",
        themeMode === "dark"
          ? "border-[var(--ds-border,#E3E4F21F)] bg-[var(--ds-surface,#1F1F21)]"
          : "border-slate-100 bg-white"
      )}
    >
      <SidebarHeader className="bg-white dark:bg-[var(--ds-surface,#1F1F21)] relative">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {sidebarHeader ?? (
                <span className="font-semibold text-base text-slate-900">Navigation</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {(isMobile || state === "expanded") && (
            <SidebarMenuItem className="pt-2 truncate">
              <ShellInstitutionSelector forceShow block />
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-[var(--ds-surface,#1F1F21)] flex-1 flex flex-col">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={cn("space-y-1", state === "collapsed" ? "mt-2 px-1" : "mt-4")}>
              {flattenedMenus.map((item) =>
                state === "collapsed" && !isMobile ? (
                  <CollapsedMenuNode
                    key={item.id}
                    item={item}
                    LinkComponent={LinkComponent}
                    onItemSelect={(menu) => {
                      menu.onSelect?.();
                      onMenuSelect?.(menu);
                    }}
                    setOpenMobile={setOpenMobile}
                    location={location}
                  />
                ) : (
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
                )
              )}
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

/* ── Collapsed icon-rail node ────────────────────────────── */
type CollapsedMenuNodeProps = {
  item: ShellMenuItem;
  LinkComponent: ComponentType<ShellLinkComponentProps>;
  onItemSelect: (item: ShellMenuItem) => void;
  setOpenMobile: (v: boolean) => void;
  location: ReturnType<typeof useLocation>;
};

const CollapsedMenuNode = ({
  item,
  LinkComponent,
  onItemSelect,
  setOpenMobile,
  location,
}: CollapsedMenuNodeProps) => {
  const hasChildren = !!item.children?.length;
  const isActive = !!item.to && item.to === location.pathname;

  // If it's a section header (no to, no children, no icon)
  if (!item.icon && !item.to && !hasChildren) {
    return (
      <div className="w-full flex justify-center mt-5 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400/80">
          {item.label}
        </span>
      </div>
    );
  }

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <CollapsedSubmenuPopover
          item={item}
          LinkComponent={LinkComponent}
          onItemSelect={onItemSelect}
          setOpenMobile={setOpenMobile}
          location={location}
        />
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild disabled={item.disabled} tooltip={item.label}>
        <LinkComponent
          to={item.to}
          href={item.href}
          onClick={(e) => {
            if (item.to && location.pathname === item.to) {
              e.preventDefault();
              setOpenMobile(false);
              return;
            }
            onItemSelect(item);
            setOpenMobile(false);
          }}
          className="group/iconbtn flex w-full items-center justify-center py-0.5"
        >
          {item.icon ? (
            <IconPill icon={item.icon} active={isActive} />
          ) : (
            <span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-colors",
                isActive
                  ? "bg-[#ebe9f9] text-[#3725c7] dark:bg-blue-500/15 dark:text-[var(--ds-link,#669DF1)]"
                  : "text-slate-400 group-hover/iconbtn:bg-[#ebe9f9]/70 group-hover/iconbtn:text-[#3725c7]"
              )}
            >
              {item.label.slice(0, 2)}
            </span>
          )}
        </LinkComponent>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

/* ── Expanded tree node ──────────────────────────────────── */
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
                "bg-[#ebe9f9] text-[#3725c7] shadow-[inset_2px_0_0_0_rgba(55,37,199,0.95)] dark:bg-blue-500/10 dark:text-[var(--ds-link,#669DF1)] dark:shadow-[inset_2px_0_0_0_rgba(102,157,241,0.95)]"
            )}
          >
            <div className="flex items-center gap-3" style={{ paddingLeft }}>
              {item.icon && depth === 0 && (
                <item.icon className="h-4 w-4 shrink-0 text-current" />
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
                  <span className="text-left">{item.label}</span>
                </>
              )}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-[var(--ds-link,#669DF1)]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[var(--ds-text,#CECFD2)]/60" />
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
        className="focus-visible:ring-2 focus-visible:ring-[#3725c7]/60 focus-visible:bg-[#ebe9f9] focus-visible:text-[#3725c7] dark:focus-visible:bg-[#3725c7]/10 dark:focus-visible:text-blue-200"
      >
        <LinkComponent
          to={item.to}
          href={item.href}
          onClick={(event) => {
            if (item.to && location.pathname === item.to) {
              event.preventDefault();
              setOpenMobile(false);
              return;
            }
            onItemSelect(item);
            setOpenMobile(false);
          }}
          className={cn(depth > 0 && "submenu-link")}
        >
          {item.icon && depth === 0 && (
            <item.icon className="h-4 w-4 shrink-0 text-current" />
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
            <span className="text-xs font-semibold text-[#3725c7] dark:text-[var(--ds-link,#669DF1)]">
              {item.badge}
            </span>
          )}
        </LinkComponent>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
