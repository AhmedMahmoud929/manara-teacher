import ProductCell from "@/components/shared/ProductCell";
import SortCell from "@/components/shared/SortCell";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { IInventory } from "@/types/(waraqah)/inventory";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useDeleteInventoryMutation } from "@/redux/features/(waraqah)/inventory/inventoryApi";
import EditInventoryForm from "@/components/inventory/EditInventoryFom";

// Define the columns
export const columns: ColumnDef<IInventory>[] = [
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

  {
    accessorKey: "reference",
    header: ({ column }) => {
      return (
        <SortCell
          label="المرجع"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-20 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.original.reference || "غير متوفر"}
        </div>
      );
    },
  },

  // Product
  {
    accessorKey: "product",
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
      const image = row.original.product.image;
      const imageUrl = image.startsWith("http") ? image : `/uploads/${image}`;
      return (
        <div className="p-2">
          <ProductCell
            title={row.original.product.name}
            id={row.original.product_id}
            image={imageUrl}
            // titleClassName="whitespace-nowrap"
          />
        </div>
      );
    },
  },

  // Movement Type
  {
    accessorKey: "movement_type",
    header: ({ column }) => {
      return (
        <SortCell
          label="النوع"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-center gap-1 cursor-pointer lg:w-20 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const isIn = row.original.movement_type === "in";
      return (
        <div className="flex-center">
          <span
            className={cn(
              "rounded-full text-[12px] px-3 text-right font-medium text-white",
              isIn ? "bg-emerald-500" : "bg-amber-500"
            )}
          >
            {isIn ? "داخل" : "خارج"}
          </span>
        </div>
      );
    },
  },

  // Movement Quantity
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <SortCell
          label="كمية المعاملة"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-28 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const stock = row.original.quantity;
      return (
        <span className="font-medium">
          {stock} {stock > 10 || stock === 1 ? "قطعة" : "قطع"}
        </span>
      );
    },
  },

  // Price
  {
    accessorKey: "product.price",
    header: ({ column }) => {
      return (
        <SortCell
          label="السعر"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start whitespace-nowrap lg:w-28 gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.original.product.price} ج.م</div>
      );
    },
  },

  // Date
  {
    accessorKey: "movement_date",
    header: ({ column }) => {
      return (
        <SortCell
          label="التاريخ"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-32 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {format(row.original.movement_date, "MMMM dd, yyyy hh:mma", {
            locale: arSA,
          })}
        </div>
      );
    },
  },

  // Stock Before
  {
    accessorKey: "stock_before",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكمية قبل"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-28 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const stock = row.original.stock_before;
      return (
        <span className="font-medium">
          {stock} {stock > 10 || stock === 1 ? "قطعة" : "قطع"}
        </span>
      );
    },
  },

  // Stock After
  {
    accessorKey: "stock_after",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكمية بعد"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer lg:w-28 whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const stock = row.original.stock_after;
      return (
        <span className="font-medium">
          {stock} {stock > 10 || stock === 1 ? "قطعة" : "قطع"}
        </span>
      );
    },
  },

  // Available Quantity Before
  {
    accessorKey: "available_quantity_before",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكمية المتاحة قبل"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-2 cursor-pointer lg:w-28 text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const available_quantity_before = row.original.available_quantity_before;
      return (
        <span className="font-medium">
          {available_quantity_before}{" "}
          {available_quantity_before > 10 || available_quantity_before === 1
            ? "قطعة"
            : "قطع"}
        </span>
      );
    },
  },

  // Available Quantity After
  {
    accessorKey: "available_quantity_after",
    header: ({ column }) => {
      return (
        <SortCell
          label="الكمية المتاحة بعد"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-2 cursor-pointer lg:w-28 text-right"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const available_quantity_after = row.original.available_quantity_after;
      return (
        <span className="font-medium">
          {available_quantity_after}{" "}
          {available_quantity_after > 10 || available_quantity_after === 1
            ? "قطعة"
            : "قطع"}
        </span>
      );
    },
  },

  // Actions
  // {
  //   id: "actions",
  //   header: () => <div className="text-center text-base">إجراء</div>,
  //   cell: ({ row }) => {
  //     const [deleteInvItem, { isLoading }] = useDeleteInventoryMutation();

  //     const handleDelete = () => {
  //       handleReqWithToaster("جاري حذف العنصر...", async () => {
  //         await deleteInvItem(row.original.id).unwrap();
  //       });
  //     };

  //     return (
  //       <div className="flex-center px-4">
  //         {isLoading ? (
  //           <Loader size={32} className="text-primary animate-spin" />
  //         ) : (
  //           <div className="flex-center">
  //             {/* Edit */}
  //             {/* <EditInventoryForm inventoryItem={row.original as any}>
  //               <Button
  //                 variant={"ghost"}
  //                 icon={<Pencil />}
  //                 className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
  //               />
  //             </EditInventoryForm> */}

  //             {/* Delete */}
  //             <>
  //               <DeleteConfirmationDialog
  //                 onDelete={handleDelete}
  //                 name={"العنصر"}
  //               >
  //                 <div className="rounded-full flex items-center gap-2 flex-row py-3 px-3 hover:!bg-[#ffe9e9] cursor-pointer text-red-600 hover:!text-red-700">
  //                   <Trash2 className="h-4 w-4" />
  //                 </div>
  //               </DeleteConfirmationDialog>
  //             </>
  //           </div>
  //         )}
  //       </div>
  //     );
  //   },
  // },
];
