import { useCallback, useEffect, useMemo, useState } from "react";
import { useShellConfig } from "./ShellContext";
import { ShellPaginationConfig } from "./types";

type UseShellPaginationOptions = {
  enabled?: boolean;
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  totalItems?: number;
  totalPages?: number;
  label?: string;
  showNumbers?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
  onPageSizeChange?: (page: number, pageSize: number) => void;
  loading?: boolean;
  initialLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
};

type UseShellPaginationResult = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems?: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
  pageSizeOptions: number[];
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const FALLBACK_PAGE_SIZES = [10, 25, 50];

export const useShellPagination = (
  options: UseShellPaginationOptions = {}
): UseShellPaginationResult => {
  const {
    enabled = true,
    initialPage = 1,
    pageSizeOptions,
    totalItems: totalItemsProp,
    totalPages: totalPagesProp,
    label,
    showNumbers,
    onPageChange,
    onPageSizeChange,
  loading,
  initialLoading = false,
  onLoadingChange,
  } = options;
  const resolvedPageSizeOptions =
    pageSizeOptions && pageSizeOptions.length
      ? pageSizeOptions
      : FALLBACK_PAGE_SIZES;
  const initialPageSize =
    options.initialPageSize ?? resolvedPageSizeOptions[0];

  const { setPagination } = useShellConfig();
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalItems, setTotalItems] = useState<number | undefined>(
    totalItemsProp
  );
  const [internalLoading, setInternalLoading] = useState(initialLoading);
  const effectiveLoading =
    loading !== undefined ? loading : internalLoading;

  useEffect(() => {
    if (totalItemsProp !== undefined) {
      setTotalItems(totalItemsProp);
    }
  }, [totalItemsProp]);

  useEffect(() => {
    if (loading !== undefined) {
      setInternalLoading(loading);
    }
  }, [loading]);

  const computedTotalPages = useMemo(() => {
    if (totalPagesProp) {
      return totalPagesProp;
    }
    if (!totalItems) {
      return 1;
    }
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, totalPagesProp, pageSize]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
      onPageChange?.(nextPage, pageSize);
    },
    [onPageChange, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (nextSize: number) => {
      setPageSize(nextSize);
      setPage(1);
      onPageSizeChange?.(1, nextSize);
    },
    [onPageSizeChange]
  );

  const setLoadingState = useCallback(
    (state: boolean) => {
      if (loading === undefined) {
        setInternalLoading(state);
      }
      onLoadingChange?.(state);
    },
    [loading, onLoadingChange]
  );

  useEffect(() => {
    if (!enabled) {
      setPagination?.(null);
      return;
    }

    const config: ShellPaginationConfig = {
      page,
      totalPages: computedTotalPages,
      onChange: handlePageChange,
      pageSize,
      pageSizeOptions: resolvedPageSizeOptions,
      onPageSizeChange: handlePageSizeChange,
      totalItems,
      label,
      showNumbers,
      isLoading: effectiveLoading,
    };

    setPagination?.(config);

    return () => {
      setPagination?.(null);
    };
  }, [
    computedTotalPages,
    enabled,
    handlePageChange,
    handlePageSizeChange,
    label,
    page,
    pageSize,
    resolvedPageSizeOptions,
    setPagination,
    showNumbers,
    totalItems,
    effectiveLoading,
  ]);

  return {
    page,
    pageSize,
    totalPages: computedTotalPages,
    totalItems,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    setTotalItems,
    pageSizeOptions: resolvedPageSizeOptions,
    isLoading: effectiveLoading,
    setLoading: setLoadingState,
  };
};

