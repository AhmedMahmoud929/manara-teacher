import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";

function DataTable({
  table,
  isLoading,
  currentPage,
  totalPages,
  pageSize,
  setPageSize,
  onPageChange,
  tableClassName,
  rowClassName,
  headClassName,
  cellClassName,
  headCellClassName,
}: {
  // Main
  table: TableType<any>;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  onPageChange: (page: number) => void;
  // Styling
  tableClassName?: string;
  rowClassName?: string;
  headClassName?: string;
  cellClassName?: string;
  headCellClassName?: string;
}) {
  return (
    <>
      <Table className={cn("border-collapse", tableClassName)}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className={cn("bg-gray-50", headClassName)}
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn("border border-gray-200", headCellClassName)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-32 text-center border border-gray-200"
              >
                <Loader
                  size={32}
                  className="animate-spin text-primary mx-auto"
                />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, ix) => (
              <TableRow
                key={row.id + ix}
                className={cn("even:bg-gray-50 h-16", rowClassName)}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn("border border-gray-200", cellClassName)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center border border-gray-200"
              >
                لا توجد نتائج.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} من{" "}
            {table.getFilteredRowModel().rows.length} صف (صفوف) محددة.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              صفحة {currentPage} من {totalPages}
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                onPageChange(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={10} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">عناصر لكل صفحة</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataTable;
