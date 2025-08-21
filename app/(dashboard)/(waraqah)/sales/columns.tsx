import { CustomerStatusBadge } from "@/components/shared/CustomerStatusBadge";
import SortCell from "@/components/shared/SortCell";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ICategory } from "@/types/(waraqah)/category";
import { useDeleteCategoryMutation } from "@/redux/features/(waraqah)/categories/categoriesApi";
import { Eye, Loader, Pencil, Trash2 } from "lucide-react";
import { EditCategorySheet } from "@/components/categories/EditCategorySheet";
import { useAppDispatch } from "@/redux/app/hooks";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { ISale } from "@/types/(waraqah)/sale";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

// Define the columns
export const columns: ColumnDef<ISale>[] = [
  // Checkboxes
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex-center pr-4 pl-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="تحديد الكل"
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex-center pr-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="تحديد الصف"
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Date
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <SortCell
          label="التاريخ"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-48 items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <span className="text-14 font-semibold mb-1 line-clamp-1">
        {format(new Date(row.original.date), "EEEE, dd MMMM yyyy", {
          locale: arSA,
        })}
      </span>
    ),
  },

  // Total
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <SortCell
          label="المبيعات"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-44 items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <span className="text-14 font-semibold mb-1 line-clamp-1">
        {row.original.total} ج.م
      </span>
    ),
  },

  // Quantity
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكمية المباعة "
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-44 items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      return (
        <span className="text-14 font-semibold mb-1 line-clamp-1">
          {quantity > 1 ? quantity : null}{" "}
          {quantity === 1
            ? "قطعة واحدة"
            : quantity > 1 && quantity <= 10
            ? "قطع"
            : "قطعة"}
        </span>
      );
    },
  },

  // Orders Count
  {
    accessorKey: "order_count",
    header: ({ column }) => {
      return (
        <SortCell
          label="عدد الأوردرات"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-44 items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const orders_count = row.original.order_count;
      return (
        <span className="text-14 font-semibold mb-1 line-clamp-1">
          {orders_count > 1 ? orders_count : null}{" "}
          {orders_count === 1
            ? "أوردر واحد"
            : orders_count > 1 && orders_count <= 10
            ? "أوردرات"
            : "أوردر"}
        </span>
      );
    },
  },

  // Orders Count
  {
    accessorKey: "shipping_total",
    header: ({ column }) => {
      return (
        <SortCell
          label="مصاريف الشحن"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-44 items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-14 font-semibold mb-1 line-clamp-1">
          {row.original.shipping_total} ج.م
        </span>
      );
    },
  },
];
