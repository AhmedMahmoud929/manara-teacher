import { CustomerStatusBadge } from "@/components/shared/CustomerStatusBadge";
import SortCell from "@/components/shared/SortCell";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ICategory } from "@/types/(waraqah)/category";
import { useDeleteCategoryMutation } from "@/redux/features/(waraqah)/categories/categoriesApi";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { EditCategorySheet } from "@/components/categories/EditCategorySheet";
import { useAppDispatch } from "@/redux/app/hooks";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

// Define the columns
export const columns: ColumnDef<ICategory>[] = [
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
          label="القسم"
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
  // Products Count
  {
    accessorKey: "products_count",
    header: ({ column }) => {
      return (
        <SortCell
          label="مجموع المنتجات"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex w-44 items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const total = row.original.products_count;
      return (
        <div className="pr-2">
          {total} {total < 10 ? "منتجات" : "منتج"}
        </div>
      );
    },
  },
  // Created At
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <SortCell
          label="تاريخ الإنشاء"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {format(row.original.created_at, "d EEEE, MMMM yyyy ", {
          locale: arSA,
        })}
      </div>
    ),
  },
  // Status
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return (
        <SortCell
          label="الحالة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const status = row.original.is_active ? "active" : "inactive";
      return <CustomerStatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // Actions
  {
    id: "actions",
    header: () => <div className="text-center text-base">إجراء</div>,
    cell: ({ row }) => {
      const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
      const dispatch = useAppDispatch();

      const handleDelete = () => {
        handleReqWithToaster("جاري حذف القسم...", async () => {
          await deleteCategory(row.original.id).unwrap();
        });
      };

      return (
        <div className="flex-center">
          {isLoading ? (
            <Loader size={32} className="text-primary animate-spin" />
          ) : (
            <div className="flex-center">
              {/* Edit */}
              <EditCategorySheet id={row.original.id}>
                <Button
                  variant={"ghost"}
                  icon={<Pencil />}
                  className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
                />
              </EditCategorySheet>

              {/* Delete */}
              <>
                <DeleteConfirmationDialog
                  onDelete={handleDelete}
                  name={"القسم"}
                >
                  <div className="rounded-full flex items-center gap-2 flex-row py-3 px-3 hover:!bg-[#ffe9e9] cursor-pointer text-red-600 hover:!text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </div>
                </DeleteConfirmationDialog>
              </>
            </div>
          )}
        </div>
      );
    },
  },
];
