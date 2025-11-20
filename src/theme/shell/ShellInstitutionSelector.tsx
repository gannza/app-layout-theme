import { useEffect, useState } from "react";
import { useShellConfig } from "./ShellContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShellInstitution } from "./types";

const getInitials = (value?: string) =>
  value ? value.slice(0, 4).toUpperCase() : "—";

type ShellInstitutionSelectorProps = {
  forceShow?: boolean;
  block?: boolean;
};

export const ShellInstitutionSelector = ({ forceShow = false, block = false  }: ShellInstitutionSelectorProps = {}) => {
  const {
    institutions,
    selectedInstitutionId,
    onInstitutionChange,
    institutionPlaceholder = "Select institution",
    showInstitutionSelector = true,
  } = useShellConfig();

  const [open, setOpen] = useState(false);
  const [internalId, setInternalId] = useState<string | undefined>(
    selectedInstitutionId
  );

  useEffect(() => {
    setInternalId(selectedInstitutionId);
  }, [selectedInstitutionId]);

  // if ((!forceShow && !showInstitutionSelector) || !institutions?.length)
  //   return null;

  const resolvedId = internalId ?? institutions?.[0]?.id;
  const selected =
    institutions?.find((inst) => inst.id === resolvedId) ?? institutions?.[0];

  const handleSelect = (institution: ShellInstitution) => {
    setInternalId(institution.id);
    onInstitutionChange?.(institution.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          block={block}
          type="button"
          variant="ghost"
          size="lg"
          title={selected?.name || institutionPlaceholder}
          className="h-9  dark:border-slate-700 hover:bg-slate-100 hover:text-blue-500 px-2 pr-3 flex items-center gap-2 text-sm"
        >
          <span className="inline-flex truncate max-w-[200px]">
            {block ? selected?.name : (selected?.acronym || institutionPlaceholder)}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-80" align="start">
        <Command>
          <CommandInput placeholder="Search institutions..." />
          <CommandList>
            <CommandEmpty>No institution found.</CommandEmpty>
            <CommandGroup>
              {institutions?.map((institution) => (
                <CommandItem
                  key={institution.id}
                  value={institution.name}
                  onSelect={() => handleSelect(institution)}
                  className={cn(
                    "flex items-center gap-3 hover:bg-slate-100 hover:text-blue-500",
                    institution.id === resolvedId &&
                      "bg-slate-100 text-blue-500"
                  )}
                >
                  <span className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center">
                    {getInitials(institution.acronym)}
                  </span>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{institution.name}</span>
                    <span className="text-xs text-slate-500">
                      {institution.acronym}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

