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

  // Enforce your requested menu: remove Profile + Account settings.
  const extraItems = menuItems.filter(
    (i) => !["profile", "settings", "switch", "logout"].includes(i.id)
  );


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full border border-slate-200 bg-white/70 hover:bg-white dark:border-[var(--ds-border,#E3E4F21F)] dark:bg-[var(--ds-surface,#1F1F21)] dark:hover:bg-[var(--ds-surface,#1F1F21)]"
        >
          <Avatar className="h-9 w-9 border border-slate-200/70 dark:border-[var(--ds-border,#E3E4F21F)]">
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
        </Button>
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
            <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-1 w-44">
            <DropdownMenuRadioGroup
              value={themeMode}
              onValueChange={(value) =>
                setThemeMode(value as "light" | "dark")
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

        <DropdownMenuItem
          className="flex items-center gap-3 px-4 py-2 cursor-pointer rounded-none focus:bg-slate-100 dark:focus:bg-slate-800 text-red-600 focus:text-red-600"
          onSelect={(event) => {
            event.preventDefault();
            logoutItem?.onSelect?.();
          }}
          asChild={!!logoutItem?.href}
        >
          {logoutItem?.href ? (
            <a href={logoutItem.href}>
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">
                {logoutItem.label || "Log out"}
              </span>
            </a>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">
                {logoutItem?.label || "Log out"}
              </span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

