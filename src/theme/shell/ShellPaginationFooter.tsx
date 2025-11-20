"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ShellPaginationFooterProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  showNumbers?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
  label?: string;
  isLoading?: boolean;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];

export const ShellPaginationFooter: React.FC<ShellPaginationFooterProps> = ({
  page,
  totalPages,
  onChange,
  showNumbers = true,
  pageSize,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
  totalItems,
  label,
  isLoading = false,
}) => {
  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) pages.push(1, 2, 3, 4, "...", totalPages);
      else if (page >= totalPages - 2)
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      else pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }

    return pages;
  };

  const pages = generatePages();
  const effectivePageSize = pageSize ?? pageSizeOptions[0];
  const canChangePageSize = typeof onPageSizeChange === "function";
  const startItem =
    totalItems !== undefined
      ? Math.min((page - 1) * effectivePageSize + 1, totalItems)
      : null;
  const endItem =
    totalItems !== undefined
      ? Math.min(page * effectivePageSize, totalItems)
      : null;
  const rangeLabel =
    label ??
    (startItem && endItem
      ? `Showing ${startItem}–${endItem}${
          totalItems ? ` of ${totalItems}` : ""
        }`
      : `Page ${page} of ${totalPages}`);

  return (
    <div className="sticky bottom-0 z-30 border-t w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur">
      <div className="w-full py-2 px-3 sm:px-5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="font-semibold text-slate-900 dark:text-white text-sm">
              {rangeLabel}
            </span>
            {totalItems !== undefined && (
              <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total {totalItems}
              </span>
            )}
            {isLoading && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-blue-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3 w-full lg:w-auto">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs shadow-sm bg-white/80 dark:bg-slate-800/60 dark:border-slate-700",
                (!canChangePageSize || isLoading) && "opacity-60"
              )}
            >
              <span className="text-[10px] uppercase tracking-wide text-slate-400">
                Per page
              </span>
              <Select
                value={String(effectivePageSize)}
                onValueChange={(value) => {
                  if (!canChangePageSize || isLoading) return;
                  const nextSize = Number(value);
                  if (!Number.isNaN(nextSize)) {
                    onPageSizeChange?.(nextSize);
                  }
                }}
                disabled={!canChangePageSize || isLoading}
              >
                <SelectTrigger className="h-7 w-16 border-none bg-transparent px-0 text-sm focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder={effectivePageSize} />
                </SelectTrigger>
                <SelectContent align="end">
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className={cn(
                "rounded-full border border-slate-200 bg-white/80 p-0.5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60",
                isLoading && "opacity-60"
              )}
            >
              <Pagination>
                <PaginationContent className="flex items-center gap-0.5 text-xs">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={page === 1}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs transition-colors",
                        (page === 1 || isLoading) &&
                          "pointer-events-none opacity-40"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isLoading) return;
                        if (page > 1) onChange(page - 1);
                      }}
                    />
                  </PaginationItem>

                  {showNumbers &&
                    pages.map((p, i) => (
                      <PaginationItem key={i}>
                        {p === "..." ? (
                          <span className="px-1.5 text-gray-400 select-none">
                            ...
                          </span>
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (isLoading) return;
                              if (typeof p === "number") onChange(p);
                            }}
                            isActive={p === page}
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                              p === page
                                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                                : "hover:bg-blue-500 text-gray-700 dark:hover:bg-slate-700 dark:text-slate-200"
                            )}
                          >
                            {p}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={page === totalPages}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs transition-colors",
                        (page === totalPages || isLoading) &&
                          "pointer-events-none opacity-40"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isLoading) return;
                        if (page < totalPages) onChange(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

