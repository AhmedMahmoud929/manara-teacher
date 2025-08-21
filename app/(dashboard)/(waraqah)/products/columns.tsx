import ProductCell from "@/components/shared/ProductCell";
import { ProductStatusBadge } from "@/components/shared/ProductStatusBadge";
import SortCell from "@/components/shared/SortCell";
import { TableDropdown } from "@/components/shared/TableDropdown";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { IProduct } from "@/types/(waraqah)/product";
import { useGetSingleCategoryQuery } from "@/redux/features/(waraqah)/categories/categoriesApi";
import { Loader, Pencil, Trash2, Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { useDeleteProductMutation } from "@/redux/features/products/productsApi";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import ProductDetailsDialog from "@/components/products/ProductDetailsDialog";

// Define the columns
export const columns: ColumnDef<IProduct>[] = [
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
  // Product
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <SortCell
          label="المنتج"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start whitespace-nowrap lg:w-64 gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const image = row.original.image;
      const imageUrl = image.startsWith("http") ? image : `/uploads/${image}`;
      return (
        <div className="p-2">
          <ProductCell
            title={row.original.name}
            id={row.original.id}
            image={imageUrl}
          />
          {/* <ProductDetailsDialog product={row.original}>
          </ProductDetailsDialog> */}
        </div>
      );
    },
  },
  // Stock
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكمية كاملة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-32 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const stock = Number(row.getValue("stock"));
      return (
        <span>
          {stock} {stock > 10 ? "قطعة" : "قطع"}
        </span>
      );
    },
  },
  {
    accessorKey: "available_stock",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكمية المتاحة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap lg:w-32"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const stock = Number(row.getValue("available_stock"));
      return (
        <span className="">
          {stock} {stock > 10 ? "قطعة" : "قطع"}
        </span>
      );
    },
  },
  // Max Quantity Per Order
  {
    accessorKey: "max_quantity_per_order",
    header: ({ column }) => {
      return (
        <SortCell
          label="الحد الأقصى للطلب"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap lg:w-36"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const maxQty = row.original.max_quantity_per_order
        ? Number(row.original.max_quantity_per_order)
        : null;
      return (
        <span className="">
          {maxQty ? `${maxQty} ${maxQty > 10 ? "قطعة" : "قطع"}` : "غير محدد"}
        </span>
      );
    },
  },
  // Department
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <SortCell
          label="القسم"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start lg:w-24 gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.category.name}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // Final Price
  {
    accessorKey: "price_before_discount",
    header: ({ column }) => {
      return (
        <SortCell
          label="قبل الخصم"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-32 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price_before_discount"));
      const formatted = new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "EGP",
      }).format(price);

      return <div className="text-right w-20 font-medium">{formatted}</div>;
    },
  },
  // Final Price
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <SortCell
          label="السعر النهائي"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-32 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("ar-EG", {
        style: "currency",
        currency: "EGP",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  // Is Active
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return (
        <SortCell
          label="نشط"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const isActive =
        row.original.is_active !== undefined
          ? Boolean(Number(row.original.is_active))
          : true;

      return (
        <div className="flex justify-center">
          {isActive ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-500" />
          )}
        </div>
      );
    },
  },
  // Is Breakable
  {
    accessorKey: "is_breakable",
    header: ({ column }) => {
      return (
        <SortCell
          label="قابل للكسر"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const isBreakable = Boolean(Number(row.original.is_breakable));

      return (
        <div className="flex justify-center">
          {isBreakable ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <X className="h-5 w-5 text-red-500" />
          )}
        </div>
      );
    },
  },
  // Actions
  {
    id: "actions",
    header: () => <div className="text-center text-base">إجراء</div>,
    cell: ({ row }) => {
      const [deleteProduct, { isLoading }] = useDeleteProductMutation();

      const handleDelete = () => {
        handleReqWithToaster("جاري حذف المنتج...", async () => {
          await deleteProduct(row.original.id).unwrap();
        });
      };

      return (
        <div className="flex-center">
          {isLoading ? (
            <Loader size={32} className="text-primary animate-spin" />
          ) : (
            <div className="flex-center">
              {/* Edit */}
              <Link
                href={`/dashboard/products/edit?product=${row.original.id}`}
              >
                <Button
                  variant={"ghost"}
                  icon={<Pencil />}
                  className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
                />
              </Link>

              {/* Delete */}
              <>
                <DeleteConfirmationDialog
                  onDelete={handleDelete}
                  name={"المنتج"}
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
