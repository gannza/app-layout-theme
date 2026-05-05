import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useShellConfig } from "./ShellContext";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Moon,
  Sun,
  Circle,
  ChevronDown,
} from "lucide-react";
import { getAvatarColor } from "./avatarColors";
import { ShellUserMenuItem } from "./types";

export const ShellUserMenu = () => {
  const { user, themeMode, setThemeMode } = useShellConfig();
  if (!user) return null;

  const hashString = (value: string) => {
    // Simple stable hash for picking a color theme.
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const coverThemes = [
    "bg-gradient-to-br from-[#2563eb] to-[#dbeafe]",
    "bg-gradient-to-br from-[#10b981] to-[#dcfce7]",
    "bg-gradient-to-br from-[#eab308] to-[#F4F5F7]",
    "bg-gradient-to-br from-[#f3e8ff] to-[#dbeafe]",
    "bg-gradient-to-br from-[#F4F5F7] to-[#dcfce7]",
    "bg-gradient-to-br from-[#dbeafe] to-[#2563eb]",
  ];

  const coverKey = user.email ?? user.name;
  const coverClassName = coverThemes[hashString(coverKey) % coverThemes.length];

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarColor = getAvatarColor(user.name);

  const menuItems: ShellUserMenuItem[] = user.menuItems ?? [];
  const logoutItem = menuItems.find((i) => i.id === "logout");
  const manageAccountHref = menuItems.find((item) =>
    ["manage-account", "account", "settings", "profile"].includes(item.id)
  )?.href;

  // Enforce your requested menu: remove Profile + Account settings.
  const extraItems = menuItems.filter(
    (i) => !["profile", "settings", "switch", "logout"].includes(i.id)
  );


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2.5 rounded-xl border px-2.5 py-1.5 h-auto",
            "bg-white/70 hover:bg-white border-slate-200 transition-colors",
            "dark:bg-[var(--ds-surface,#1F1F21)] dark:hover:bg-[var(--ds-surface-overlay,#2B2C2F)] dark:border-[var(--ds-border,#E3E4F21F)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0 border border-slate-200/70 dark:border-[var(--ds-border,#E3E4F21F)]">
            {user.avatarUrl && (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            )}
            <AvatarFallback
              className={cn(
                "text-xs font-semibold flex items-center justify-center w-full h-full rounded-full",
                avatarColor.bg,
                avatarColor.text
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0 max-w-[140px]">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate w-full leading-tight">
              {user.name}
            </span>
            {(user.subtitle ?? user.email) && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate w-full leading-tight mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                {user.subtitle ?? user.email}
              </span>
            )}
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0 ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[340px] p-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-[var(--ds-border,#E3E4F21F)] dark:bg-[var(--ds-surface,#1F1F21)]"
        sideOffset={8}
      >
        {/* Profile card header (cover + avatar) */}
        <div className={cn("relative h-24", coverClassName)}>
          {/* Intentionally empty: cover color only (no upload UI). */}
          <div className="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/10"></div>
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10"></div>
        </div>

        <div className="px-4 pb-3">
          <div className="-mt-6 flex items-start gap-3">
            <Avatar className="h-12 w-12 border border-slate-200 bg-white dark:border-[var(--ds-border,#E3E4F21F)] dark:bg-[var(--ds-surface,#1F1F21)]">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              )}
              <AvatarFallback
                className={cn(
                  "text-sm font-semibold flex items-center justify-center w-full h-full rounded-full",
                  avatarColor.bg,
                  avatarColor.text
                )}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 pt-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user.name}
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                Hi, {user.name.split(" ")[0] || "there"}!
              </span>
              {user.extras}
            </div>
          </div>

          <div className="mt-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 w-full justify-center bg-slate-100/70 hover:bg-slate-100 dark:bg-[var(--ds-surface,#1F1F21)] dark:hover:bg-[var(--ds-surface,#1F1F21)] text-slate-900 dark:text-[var(--ds-text,#CECFD2)]"
              onClick={() => {
                if (!manageAccountHref) return;
                window.open(manageAccountHref, "_blank", "noopener,noreferrer");
              }}
            >
              Manage your account
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            className={cn(
              "flex items-center gap-3 px-4 py-2 cursor-pointer rounded-none focus:bg-slate-100 dark:focus:bg-slate-800",
              "data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800"
            )}
          >
            <Moon className="h-4 w-4 text-[#3725c7] dark:text-[var(--ds-link,#669DF1)]" />
            <span className="text-sm font-medium">Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-1 w-44">
            <DropdownMenuRadioGroup
              value={themeMode}
              onValueChange={(value) =>
                setThemeMode(value as "light" | "dark" | "white")
              }
            >
              <DropdownMenuRadioItem
                value="light"
                className="flex items-center gap-2 cursor-pointer px-2 py-2 rounded-sm focus:bg-accent"
              >
                <Sun className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                <span className="text-sm">Light</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="dark"
                className="flex items-center gap-2 cursor-pointer px-2 py-2 rounded-sm focus:bg-accent"
              >
                <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                <span className="text-sm">Dark</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="white"
                className="flex items-center gap-2 cursor-pointer px-2 py-2 rounded-sm focus:bg-accent"
              >
                <Circle className="h-4 w-4 text-slate-400 dark:text-slate-200" />
                <span className="text-sm">White</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {extraItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            className={cn(
              "flex items-center py-2 cursor-pointer px-4 rounded-none focus:bg-slate-100 dark:focus:bg-slate-800",
              item.danger && "text-red-600 focus:text-red-600"
            )}
            onSelect={(event) => {
              event.preventDefault();
              item.onSelect?.();
            }}
            asChild={!!item.href}
          >
            {item.href ? (
              <a href={item.href}>
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ) : (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </DropdownMenuItem>
        ))}

        <div className="px-3 pb-3 pt-1">
          {logoutItem?.href ? (
            <a
              href={logoutItem.href}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-danger-muted px-3 py-2 text-sm font-medium text-danger hover:bg-danger/15 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>{logoutItem.label || "Sign out"}</span>
            </a>
          ) : (
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-danger-muted px-3 py-2 text-sm font-medium text-danger hover:bg-danger/15 transition-colors cursor-pointer"
              onClick={() => logoutItem?.onSelect?.()}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>{logoutItem?.label || "Sign out"}</span>
            </button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

