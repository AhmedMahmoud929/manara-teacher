import CustomerCell from "@/components/shared/CustomerCell";
import ProductCell from "@/components/shared/ProductCell";
import { CustomerStatusBadge } from "@/components/shared/CustomerStatusBadge";
import SortCell from "@/components/shared/SortCell";
import { TableDropdown } from "@/components/shared/TableDropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ICategory } from "@/types/(waraqah)/category";
import { useDeleteCategoryMutation } from "@/redux/features/(waraqah)/categories/categoriesApi";
import { Edit, Eye, Loader, Pencil, Save, Trash2 } from "lucide-react";
import { EditCategorySheet } from "@/components/categories/EditCategorySheet";
import { useAppDispatch } from "@/redux/app/hooks";
import {
  setEditCategoryId,
  setIsEditCategorySheetOpen,
} from "@/redux/features/(waraqah)/categories/categorySlice";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { IGovernateAdmin } from "@/types/(waraqah)/governates";
import { useState } from "react";
import { EditGovernateSheet } from "@/components/governates/EditGovernateSheet";

// Define the columns
export const columns: ColumnDef<IGovernateAdmin>[] = [
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
  // Name
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortCell
          label="المحافظة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-48 items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col p-2">
        <span className="text-14 font-medium mb-1 line-clamp-1">
          {row.original.name}
        </span>
        <span className="text-12 text-black/70 font-light">
          {row.original.id}#
        </span>
      </div>
    ),
  },

  // Price
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <SortCell
          label="السعر"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-44 items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-start">
          <div className="flex-center gap-1 pr-2">
            <span>{row.original.price}</span>
            <span>ج.م</span>
          </div>
        </div>
      );
    },
  },

  // Price for fragile
  {
    accessorKey: "breakable_price",
    header: ({ column }) => {
      return (
        <SortCell
          label="السعر للمنتجات القابلة للكسر"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-40 whitespace-nowrap items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-start  pr-2">
          {row.original.breakable_price ? (
            <div className="flex-center gap-1">
              <span>{row.original.breakable_price}</span>
              <span>ج.م</span>
            </div>
          ) : (
            <span>لم يتم التحديد</span>
          )}
        </div>
      );
    },
  },

  // Status
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return (
        <SortCell
          label="الحالة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const status = row.original.is_active ? "active" : "inactive";
      return (
        <div className="flex-center ">
          <CustomerStatusBadge status={status} />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // Cities
  {
    id: "id",
    header: () => <div className="text-center text-base">المدن</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/settings/governates/${row.original.id}/cities`}
          className="flex-center gap-1"
        >
          <span className="text-[15px] underline">عرض</span>
          {/* <Eye size={20} /> */}
        </Link>
      );
    },
  },

  // Actions
  {
    id: "actions",
    header: () => <div className="text-center text-base">إجراء</div>,
    cell: ({ row }) => {
      return (
        <EditGovernateSheet governate={row.original}>
          <Button
            variant={"ghost"}
            icon={<Pencil />}
            className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer -ml-6 mr-2"
          />
        </EditGovernateSheet>
      );
    },
  },
];
