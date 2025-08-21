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
import { ICity, IGovernateAdmin } from "@/types/(waraqah)/governates";
import { useState } from "react";

// Define the columns
export const columns: ColumnDef<ICity>[] = [
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
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <SortCell
          label="ID"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-48 items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col p-2">
        <span className="text-14 font-medium mb-1 line-clamp-1">
          {row.original.id}#
        </span>
      </div>
    ),
  },

  // Price
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortCell
          label="المدينة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-44 items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col p-2">
          <span className="text-14 font-medium mb-1 line-clamp-1">
            {row.original.name}
          </span>
        </div>
      );
    },
  },
];
