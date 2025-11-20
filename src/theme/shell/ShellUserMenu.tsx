import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useShellConfig } from "./ShellContext";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { getAvatarColor } from "./avatarColors";
import { ShellUserMenuItem } from "./types";

export const ShellUserMenu = () => {
  const { user } = useShellConfig();
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarColor = getAvatarColor(user.name);

  const menuItems: ShellUserMenuItem[] = user.menuItems ?? [
    {
      id: "profile",
      label: "Profile",
      icon: UserIcon,
      onSelect: () => console.info("Profile clicked"),
    },
    {
      id: "settings",
      label: "Account settings",
      icon: Settings,
      onSelect: () => console.info("Settings clicked"),
    },
    // {
    //   id: "theme",
    //   label: "Theme",
    //   icon: Palette,
    //   onSelect: () => console.info("Theme clicked"),
    // },
    // {
    //   id: "switch",
    //   label: "Switch account",
    //   icon: Users,
    //   onSelect: () => console.info("Switch account clicked"),
    // },
    {
      id: "logout",
      label: "Log out",
      icon: LogOut,
      onSelect: () => console.info("Log out clicked"),
      danger: true,
    },
  ];


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full shadow-sm border border-blue-500/50"
        >
          <Avatar className="h-10 w-10 border border-blue-500/40">
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
        className="w-64 rounded-xl shadow-lg"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-blue-500/40">
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
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                {user.name}
              </span>
              {user.email && (
                <span className="text-xs text-slate-500">{user.email}</span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            className={cn(
              "flex items-center gap-2 py-2 cursor-pointer",
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
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </a>
            ) : (
              <>
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

