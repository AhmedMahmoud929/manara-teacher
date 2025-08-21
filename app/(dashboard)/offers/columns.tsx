import CustomerCell from "@/components/shared/CustomerCell";
import ProductCell from "@/components/shared/ProductCell";
import { CustomerStatusBadge } from "@/components/shared/CustomerStatusBadge";
import SortCell from "@/components/shared/SortCell";
import { TableDropdown } from "@/components/shared/TableDropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/types/(waraqah)/user";
import { IOffer } from "@/types/(waraqah)/offer";
import { useAppDispatch } from "@/redux/app/hooks";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { EditCategorySheet } from "@/components/categories/EditCategorySheet";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { useDeleteOfferMutation } from "@/redux/features/(waraqah)/offers/offersApi";
import EditOfferSheet from "@/components/offers/EditOfferSheet";
import { useState } from "react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

// Define the columns
export const columns: ColumnDef<IOffer>[] = [
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
  // Name with Pic
  {
    accessorKey: "product_id",
    header: ({ column }) => {
      return (
        <SortCell
          label="العرض"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start whitespace-nowrap gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="p-2">
        <ProductCell
          title={row.original.title}
          id={row.original.id}
          image={row.original.image}
        />
      </div>
    ),
  },
  // Phone
  {
    accessorKey: "product_id",
    id: "id",
    header: ({ column }) => {
      return (
        <SortCell
          label="المنتج"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start whitespace-nowrap gap-1 w-44 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="w-44 line-clamp-1">{row.original.product.name}</div>
    ),
  },
  // Phone
  {
    accessorKey: "new_price",
    header: ({ column }) => {
      return (
        <SortCell
          label="السعر الجديد"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center whitespace-nowrap justify-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("new_price")}ج</div>,
  },
  // Start Date
  {
    accessorKey: "start_date",
    header: ({ column }) => {
      return (
        <SortCell
          label="تاريخ البدء"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center whitespace-nowrap justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.start_date), "EEEE, dd MMMM", {
          locale: arSA,
        }) || "لا يوجد"}
      </div>
    ),
  },
  // End Date
  {
    accessorKey: "end_date",
    header: ({ column }) => {
      return (
        <SortCell
          label="تاريخ الإنتهاء"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start whitespace-nowrap gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.end_date), "EEEE, dd MMMM", {
          locale: arSA,
        }) || "لا يوجد"}
      </div>
    ),
  },

  // Actions
  {
    id: "actions",
    header: () => <div className="text-center text-base">إجراء</div>,
    cell: ({ row }) => {
      const [deleteOffer, { isLoading }] = useDeleteOfferMutation();
      const dispatch = useAppDispatch();

      const handleDelete = () => {
        handleReqWithToaster("جاري حذف العرض...", async () => {
          await deleteOffer(row.original.id).unwrap();
        });
      };

      return (
        <div className="flex-center">
          {false ? (
            <Loader size={32} className="text-primary animate-spin" />
          ) : (
            <div className="flex-center">
              {/* Edit */}
              <EditOfferSheet offer={row.original}>
                <Button
                  variant={"ghost"}
                  icon={<Pencil />}
                  className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
                />
              </EditOfferSheet>

              {/* Delete */}
              <DeleteConfirmationDialog onDelete={handleDelete} name={"العرض"}>
                <div className="rounded-full flex items-center gap-2 flex-row py-3 px-3 hover:!bg-[#ffe9e9] cursor-pointer text-red-600 hover:!text-red-700">
                  <Trash2 className="h-4 w-4" />
                </div>
              </DeleteConfirmationDialog>
            </div>
          )}
        </div>
      );
    },
  },
];
