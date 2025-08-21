import CustomerCell from "@/components/shared/CustomerCell";
import ProductCell from "@/components/shared/ProductCell";
import { CustomerStatusBadge } from "@/components/shared/CustomerStatusBadge";
import SortCell from "@/components/shared/SortCell";
import { TableDropdown } from "@/components/shared/TableDropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { IUser } from "@/types/(waraqah)/user";
import { Eye, Loader, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { useDeleteUserMutation } from "@/redux/features/(waraqah)/user/userApi";
import EditUserSheet from "@/components/customer/EditUserSheet";
import { YEAR_OPTIONS } from "@/constants";
import Link from "next/link";

// Define the columns
export const columns: ColumnDef<IUser>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortCell
          label="العميل"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="p-2">
        <CustomerCell title={row.original.name} id={row.original.id} image="" />
      </div>
    ),
  },
  // Phone
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <SortCell
          label="رقم الهاتف"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  // Alt Phone
  {
    accessorKey: "alternative_phone",
    header: ({ column }) => {
      return (
        <SortCell
          label="رقم الهاتف البديل"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div>{row.getValue("alternative_phone") || "لا يوجد"}</div>
    ),
  },
  // Email
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <SortCell
          label="المرحلة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="lowercase">
          {YEAR_OPTIONS.find((opt) => opt.value === `${row.original.year}`)
            ?.label || "لم يتم التحديد"}
        </div>
      );
    },
  },
  // // Status
  // {
  //   accessorKey: "email_verified_at",
  //   header: ({ column }) => {
  //     return (
  //       <SortCell
  //         label="الحالة"
  //         isAscSorted={column.getIsSorted() === "asc"}
  //         className="flex items-center justify-center gap-1 cursor-pointer"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       />
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const status = row.getValue("email_verified_at") ? "active" : "inactive";
  //     return <CustomerStatusBadge status={status} />;
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },

  // Orders
  {
    accessorKey: "orders",
    header: ({ column }) => {
      return (
        <SortCell
          label="الأوردرات"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/orders?user=${row.original.id}`}
          className="flex-center underline"
        >
          عرض
        </Link>
      );
    },
  },

  // Actions
  {
    id: "actions",
    header: () => <div className="text-center text-base">إجراء</div>,
    cell: ({ row }) => {
      const [deleteCustomer, { isLoading }] = useDeleteUserMutation();

      const handleDelete = () => {
        handleReqWithToaster("جاري حذف العميل...", async () => {
          await deleteCustomer(row.original.id).unwrap();
        });
      };

      return (
        <div className="flex-center px-4">
          {isLoading ? (
            <Loader size={32} className="text-primary animate-spin" />
          ) : (
            <div className="flex-center">
              {/* Edit */}
              <EditUserSheet user={row.original}>
                <Button
                  variant={"ghost"}
                  icon={<Pencil />}
                  className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
                />
              </EditUserSheet>

              {/* Delete */}
              <>
                <DeleteConfirmationDialog
                  onDelete={handleDelete}
                  name={"العميل"}
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
