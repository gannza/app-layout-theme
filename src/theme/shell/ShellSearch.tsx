import { FormEvent, useEffect, useMemo, useState } from "react";
import { useShellConfig } from "./ShellContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const ShellSearch = () => {
  const { search } = useShellConfig();

  const [internalValue, setInternalValue] = useState(
    search?.value ?? search?.defaultValue ?? ""
  );

  const value = search?.value ?? internalValue;
  const debounceDelay = search?.debounceMs ?? 0;
  const [pendingValue, setPendingValue] = useState<string | null>(null);

  useEffect(() => {
    if (search?.value === undefined) return;
    setInternalValue(search.value);
  }, [search?.value]);

  useEffect(() => {
    if (pendingValue === null || debounceDelay === 0) return;
    const timeout = setTimeout(() => {
      search?.onChange?.(pendingValue);
      setPendingValue(null);
    }, debounceDelay);
    return () => clearTimeout(timeout);
  }, [pendingValue, debounceDelay, search]);

  const handleChange = (next: string) => {
    if (search?.value === undefined) {
      setInternalValue(next);
    }
    if (debounceDelay) {
      setPendingValue(next);
    } else {
      search?.onChange?.(next);
    }
  };

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    search?.onSubmit?.(value);
  };

  const renderProps = useMemo(
    () => ({
      value,
      onChange: handleChange,
      onSubmit: () => handleSubmit(),
      placeholder: search?.placeholder,
    }),
    [handleChange, value, search?.placeholder]
  );

  if (!search) return null;

  if (search.render) {
    return <>{search.render(renderProps)}</>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1 rounded-full bg-white dark:bg-[var(--ds-surface-overlay,#2B2C2F)] px-2.5 py-0.5 shadow border border-slate-200 dark:border-[var(--ds-surface-overlay,#2B2C2F)] w-full focus-within:ring-2 focus-within:ring-blue-500"
    >
      <Search className="h-4 w-4 text-slate-500 dark:text-slate-500" />
      <Input
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={search.placeholder ?? "Search anything"}
        className={cn(
          "border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-0 bg-transparent",
          "placeholder:text-slate-500 dark:placeholder:text-slate-500 text-slate-500 dark:text-slate-100"
        )}
      />
      <Button type="submit" size="sm" variant="secondary" iconStart={<Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />}>
          Search
        </Button>
    </form>
  );
};
