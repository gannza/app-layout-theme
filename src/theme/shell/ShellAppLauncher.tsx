import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useShellConfig } from "./ShellContext";
import { ExternalLink, Grip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppLauncherItem, ShellInstitution } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ShellAppLauncher = () => {
  const {
    appLauncherItems,
    themeMode,
    institutions,
    selectedInstitutionId,
    onInstitutionChange,
    institutionPlaceholder = "Select institution",
  } = useShellConfig();

  const apps = useMemo(() => appLauncherItems ?? [], [appLauncherItems]);
  const [open, setOpen] = useState(false);

  const resolvedInstitutionId = selectedInstitutionId ?? institutions?.[0]?.id;
  const selectedInstitution =
    institutions?.find(
      (inst: ShellInstitution) => inst.id === resolvedInstitutionId,
    ) ?? institutions?.[0];

  const maxVisible = 7;
  const modules = apps.filter((a) => !(a.openInNewTab ?? false));
  const visibleModules = modules.slice(0, maxVisible);
  const remainingAppsCount = Math.max(
    0,
    modules.length - visibleModules.length,
  );

  // Main list should open in the same tab (internal_app).
  const internalApps = visibleModules;

  // Recommended list should redirect to another tab (external_app).
  const externalApps = apps.filter((a) => a.openInNewTab ?? false);

  if (!apps.length) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Switch module"
          className={cn(
            "h-8 w-8 rounded-full border [&_svg]:size-4",
            themeMode === "dark"
              ? "border-slate-700 dark:hover:bg-slate-800"
              : "border-slate-200 hover:bg-slate-100 hover:text-blue-500",
          )}
        >
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Grip className="h-4 w-4 text-slate-600 hover:text-blue-500 dark:text-slate-200" />
            </TooltipTrigger>
            <TooltipContent>Switch to app or module</TooltipContent>
          </Tooltip>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[360px] p-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-[var(--ds-border,#E3E4F21F)] dark:bg-[var(--ds-surface,#1F1F21)]"
      >
        <div className="flex flex-col max-h-[560px]">
          {/* Institution dropdown */}
          {institutions?.length ? (
            <div className="px-3 pt-3 pb-2">
              <Select
                value={resolvedInstitutionId}
                onValueChange={(v) => onInstitutionChange?.(v)}
              >
                <SelectTrigger
                  className={cn(
                    "h-10 w-full border-none bg-transparent px-0 shadow-none hover:bg-transparent",
                    "focus:ring-0",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-[var(--ds-surface-overlay,#2B2C2F)] text-xs font-semibold text-slate-700 dark:text-[var(--ds-text,#CECFD2)]">
                      {getInitials(selectedInstitution?.acronym)}
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-[var(--ds-text,#CECFD2)] truncate">
                      {selectedInstitution?.name ?? institutionPlaceholder}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-[var(--ds-surface-overlay,#2B2C2F)] text-[10px] font-semibold text-slate-700 dark:text-[var(--ds-text,#CECFD2)]">
                          {getInitials(inst.acronym)}
                        </span>
                        <span>{inst.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {/* separator under institution */}
          {institutions?.length ? (
            <div className="mx-3 border-t border-slate-200 dark:border-[var(--ds-border,#E3E4F21F)]" />
          ) : null}

          {/* Apps list */}
          {internalApps.length > 0 ? (
            <div className="px-2 pb-2 pt-2">
              <div className="flex flex-col">
                {internalApps.map((item) => (
                  <AppRow
                    key={item.id}
                    item={item}
                    themeMode={themeMode}
                    onClick={() => setOpen(false)}
                  />
                ))}

                {remainingAppsCount > 0 ? (
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-100 dark:text-[var(--ds-text,#CECFD2)] dark:hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-slate-400 dark:text-[var(--ds-text,#CECFD2)]/70">
                      ...
                    </span>
                    <span> {remainingAppsCount} more</span>
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* Recommended */}
          {externalApps.length > 0 ? (
            <div className="border-t border-slate-200 dark:border-[var(--ds-border,#E3E4F21F)] bg-white dark:bg-[var(--ds-surface,#1F1F21)]">
              <div className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-[var(--ds-text,#CECFD2)]/80">
                Recommended for you
              </div>
              <div className="flex flex-col px-2 pb-2">
                {externalApps.map((item, idx) => (
                  <RecommendedRow
                    key={item.id}
                    item={item}
                    showNewBadge={idx === 0}
                    onClick={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

function getInitials(value?: string) {
  return value ? value.slice(0, 2).toUpperCase() : "—";
}

function hashString(value: string) {
  // Stable hash so we get the same "random" color per app.
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const sharedIconPalette = [
  "#dbeafe",
  "#dcfce7",
  "#dbeafe",
  "#2563eb",
  "#10b981",
  "#dcfce7",
  "#f3e8ff",
  "#eab308",
  "#F4F5F7",
];

function getIconGradient(key: string, themeMode: "light" | "dark") {
  const h = hashString(key);
  const idxA = h % sharedIconPalette.length;
  const idxBBase =
    Math.floor(h / sharedIconPalette.length) % sharedIconPalette.length;
  const idxB =
    idxBBase === idxA ? (idxBBase + 1) % sharedIconPalette.length : idxBBase;

  const colorA = sharedIconPalette[idxA];
  const colorB = sharedIconPalette[idxB];

  const alpha = themeMode === "dark" ? 0.18 : 1;
  const cA = themeMode === "dark" ? hexToRgba(colorA, alpha) : colorA;
  const cB = themeMode === "dark" ? hexToRgba(colorB, alpha) : colorB;

  return {
    backgroundImage: `linear-gradient(135deg, ${cA}, ${cB})`,
    iconColor: themeMode === "dark" ? "#CECFD2" : "#172b4d",
  };
}

const AppRow = ({
  item,
  themeMode,
  onClick,
}: {
  item: AppLauncherItem;
  themeMode: "light" | "dark";
  onClick?: () => void;
}) => {
  const icon = item.icon ? (
    <item.icon className="h-5 w-5" />
  ) : (
    <Grip className="h-5 w-5" />
  );

  const iconAppearance = getIconGradient(item.id, themeMode);

  const content = (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
        style={{
          backgroundImage: iconAppearance.backgroundImage,
          color: iconAppearance.iconColor,
        }}
      >
        {icon}
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-slate-800 dark:text-[var(--ds-text,#CECFD2)] truncate">
          {item.label}
        </span>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <a
            href={item.href}
            target={item.openInNewTab ? "_blank" : undefined}
            rel={item.openInNewTab ? "noopener noreferrer" : undefined}
            className="no-underline"
            onClick={() => {
              item.onSelect?.();
              onClick?.();
            }}
          >
            {content}
          </a>
        </TooltipTrigger>
        <TooltipContent>Switch app</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="w-full text-left no-underline"
          onClick={() => {
            item.onSelect?.();
            onClick?.();
          }}
        >
          {content}
        </button>
      </TooltipTrigger>
      <TooltipContent>Switch app</TooltipContent>
    </Tooltip>
  );
};

const RecommendedRow = ({
  item,
  showNewBadge,
  onClick,
}: {
  item: AppLauncherItem;
  showNewBadge?: boolean;
  onClick?: () => void;
}) => {
  const rightLinkIcon = (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-[var(--ds-surface-overlay,#2B2C2F)]">
      <ExternalLink className="h-3.5 w-3.5 text-slate-700 dark:text-[var(--ds-text,#CECFD2)]" />
    </span>
  );

  const content = (
    <div
      className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer "
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="min-w-0 flex flex-col">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-sm font-medium text-[#1d4ed8] dark:text-[#1d4ed8] truncate">
            {item.label}
          </span>
          {showNewBadge ? (
            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-[var(--ds-text,#CECFD2)]">
              NEW
            </span>
          ) : null}
        </div>
      </div>
      {rightLinkIcon}
    </div>
  );

  if (item.href) {
    return (
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
            onClick={() => {
              item.onSelect?.();
              onClick?.();
            }}
          >
            {content}
          </a>
        </TooltipTrigger>
        <TooltipContent>Switch app</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent>Switch app</TooltipContent>
    </Tooltip>
  );
};
