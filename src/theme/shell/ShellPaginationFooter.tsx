"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface ShellPaginationFooterProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  showNumbers?: boolean;
}

export const ShellPaginationFooter: React.FC<ShellPaginationFooterProps> = ({
  page,
  totalPages,
  onChange,
  showNumbers = true,
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

  return (
    <div className="sticky bottom-0 z-30 border-t w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur">
      <div className="w-full py-3 flex justify-center items-center px-4 sm:px-6">
        <Pagination>
          <PaginationContent className="flex items-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={page === 1}
                className={cn(
                  "transition-colors",
                  page === 1 && "pointer-events-none opacity-40"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onChange(page - 1);
                }}
              />
            </PaginationItem>

            {showNumbers &&
              pages.map((p, i) => (
                <PaginationItem key={i}>
                  {p === "..." ? (
                    <span className="px-2 text-gray-400 select-none">...</span>
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (typeof p === "number") onChange(p);
                      }}
                      isActive={p === page}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                        p === page
                          ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                          : "hover:bg-blue-100 text-gray-700"
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
                  "transition-colors",
                  page === totalPages && "pointer-events-none opacity-40"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

