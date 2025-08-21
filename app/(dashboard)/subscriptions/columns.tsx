import SortCell from "@/components/shared/SortCell";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ICoupon } from "@/types/(waraqah)/coupons";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { useDeleteCouponMutation } from "@/redux/features/(waraqah)/coupons/couponsApi";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import EditCouponSheet from "@/components/coupons/EditCouponSheet";

// Define the columns
export const columns: ColumnDef<ICoupon>[] = [
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

  // Code
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكود"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center whitespace-nowrap justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="flex-center gap-2 p-2">
        <p className="text-black/80">{row.original.id}#</p>
        <p className="font-medium w-full text-black bg-gray-100 p-2 rounded-lg">
          {row.original.code}
        </p>
      </div>
    ),
  },

  // Discount
  {
    accessorKey: "discount_percentage",
    header: ({ column }) => {
      return (
        <SortCell
          label="قيمة الخصم"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center text-right lg:w-14 justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div>{`${+row.original.discount_percentage}%`}</div>,
  },

  // Usage Limit
  {
    accessorKey: "usage_limit",
    header: ({ column }) => {
      return (
        <SortCell
          label="الحد الأقصى للإستخدام"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex lg:w-28 text-right items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("usage_limit")}</div>,
  },

  // Available Usage
  {
    accessorKey: "available_usage",
    header: ({ column }) => {
      return (
        <SortCell
          label="مرات الإستخدام المتاحة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex lg:w-28 items-center text-right justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div>{row.original.available_usage}</div>,
  },

  // Usage Limit Per User
  {
    accessorKey: "per_user_limit",
    header: ({ column }) => {
      return (
        <SortCell
          label="الحد الأقصى للإستخدام لكل مستخدم"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex lg:w-28 text-right items-center justify-start gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div>{row.original.per_user_limit}</div>,
  },

  // Valid From
  {
    accessorKey: "valid_from",
    header: ({ column }) => {
      return (
        <SortCell
          label="صالح من"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex lg:w-24 items-center whitespace-nowrap justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {format(row.original.valid_from, "EEEE, dd MMMM", { locale: arSA })}
      </div>
    ),
  },

  // Valid To
  {
    accessorKey: "valid_to",
    header: ({ column }) => {
      return (
        <SortCell
          label="صالح إلى"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex lg:w-24 items-center whitespace-nowrap justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {format(row.original.valid_to, "EEEE, dd MMMM", { locale: arSA })}
      </div>
    ),
  },

  // Actions
  {
    id: "actions",
    header: () => <div className="text-center text-base">إجراء</div>,
    cell: ({ row }) => {
      const [deleteCoupon, { isLoading }] = useDeleteCouponMutation();

      const handleDelete = () => {
        handleReqWithToaster("جاري حذف الكوبون...", async () => {
          await deleteCoupon(row.original.id).unwrap();
        });
      };

      return (
        <div className="flex-center">
          {false ? (
            <Loader size={32} className="text-primary animate-spin" />
          ) : (
            <div className="flex-center">
              {/* Edit */}
              <EditCouponSheet coupon={row.original}>
                <Button
                  variant={"ghost"}
                  icon={<Pencil />}
                  className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
                />
              </EditCouponSheet>

              {/* Delete */}
              <DeleteConfirmationDialog
                onDelete={handleDelete}
                name={"الكوبون"}
              >
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
