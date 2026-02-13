"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /**
   * Number of rows per page (default: 10)
   */
  pageSize?: number;
  /**
   * Show pagination controls (default: true)
   */
  showPagination?: boolean;
  /**
   * Custom empty state message
   */
  emptyMessage?: string;
  /**
   * Server-side pagination props
   */
  serverSidePagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  showPagination = true,
  emptyMessage = "Nenhum resultado encontrado.",
  serverSidePagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const isServerSide = !!serverSidePagination;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: isServerSide,
    pageCount: isServerSide ? serverSidePagination.totalPages : undefined,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: isServerSide
        ? {
            pageIndex: serverSidePagination.currentPage - 1,
            pageSize,
          }
        : undefined,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const currentPage = isServerSide
    ? serverSidePagination.currentPage
    : table.getState().pagination.pageIndex + 1;
  const totalPages = isServerSide
    ? serverSidePagination.totalPages
    : table.getPageCount();

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-neutral-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700 whitespace-nowrap">
            {isServerSide ? (
              <>
                {(currentPage - 1) * pageSize + 1} a{" "}
                {Math.min(
                  currentPage * pageSize,
                  serverSidePagination.totalItems,
                )}{" "}
                | {serverSidePagination.totalItems} resultado
                {serverSidePagination.totalItems !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                {table.getState().pagination.pageIndex * pageSize + 1} a{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * pageSize,
                  data.length,
                )}{" "}
                | {data.length} resultado{data.length !== 1 ? "s" : ""}
              </>
            )}
          </div>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => {
                    if (isServerSide) {
                      serverSidePagination.onPageChange(currentPage - 1);
                    } else {
                      table.previousPage();
                    }
                  }}
                  disabled={
                    isServerSide
                      ? currentPage <= 1
                      : !table.getCanPreviousPage()
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>

              {getPageNumbers().map((pageNumber, index) => (
                <PaginationItem key={index}>
                  {pageNumber === "ellipsis" ? (
                    <span className="flex h-9 w-9 items-center justify-center">
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      onClick={() => {
                        if (isServerSide) {
                          serverSidePagination.onPageChange(pageNumber);
                        } else {
                          table.setPageIndex(pageNumber - 1);
                        }
                      }}
                      isActive={currentPage === pageNumber}
                      className={cn(
                        "cursor-pointer rounded-lg",
                        currentPage === pageNumber
                          ? "bg-brand-base text-neutral-white border-transparent hover:bg-brand-dark"
                          : "border border-gray-300 bg-neutral-white text-gray-700",
                      )}
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => {
                    if (isServerSide) {
                      serverSidePagination.onPageChange(currentPage + 1);
                    } else {
                      table.nextPage();
                    }
                  }}
                  disabled={
                    isServerSide
                      ? currentPage >= totalPages
                      : !table.getCanNextPage()
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      </div>
    </div>
  );
}
