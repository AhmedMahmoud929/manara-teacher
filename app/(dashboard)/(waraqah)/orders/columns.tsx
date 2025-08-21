import SortCell from "@/components/shared/SortCell";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpRightFromSquareIcon,
  EllipsisVertical,
  ReceiptText,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster";
import { IOrder, OrderStatusEnum } from "@/types/(waraqah)/order";
import { OrderPaymentStatusBadge } from "@/components/shared/OrderPaymentStatusBadge";
import OrderDetailsSheet from "@/components/orders/orderDetailsSheet";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderStatusDropdown from "@/components/orders/OrderStatusDropdown";
import PrintInvoice from "@/components/orders/PrintInvoice";
import { useUpdateOrderStatusMutation } from "@/redux/features/(waraqah)/orders/ordersApi";
import { useRouter } from "next/navigation";
import OrderDeliverySheet from "@/components/orders/OrderDeliverySheet";

// Define the columns
export const columns: ColumnDef<IOrder>[] = [
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
          label="الطلب"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex lg:w-12 items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="p-2">
        <span className="text-14 font-medium mb-1 line-clamp-1">
          {row.original.id}#
        </span>
      </div>
    ),
  },
  // Products Count
  {
    accessorKey: "order_items.id",
    header: ({ column }) => {
      return (
        <SortCell
          label="العدد"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex lg:w-12 items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const total = row.original.order_items.length;
      return (
        <div className="w-fit">
          {total} {total < 10 ? "منتجات" : "منتج"}
        </div>
      );
    },
  },
  {
    accessorKey: "order_items",
    header: ({ column }) => {
      return (
        <SortCell
          label="المبلغ الكلي"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex lg:w-14 whitespace-nowrap items-center gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return <div className="w-fit">{row.original.total_price} ج.م</div>;
    },
  },
  // Created At
  {
    accessorKey: "created_at",
    id: "id",
    header: ({ column }) => {
      return (
        <SortCell
          label="تاريخ الطلب"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center whitespace-nowrap justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      // Assuming format and arSA from date-fns are imported in the file scope
      <div>
        {format(new Date(row.original.created_at), "EEEE, dd MMMM", {
          locale: arSA,
        })}
      </div>
    ),
  },
  {
    accessorKey: "invoice_status",
    header: ({ column }) => {
      return (
        <SortCell
          label="حالة الدفع"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <OrderPaymentStatusBadge
            status={row.original.invoice_status}
            invoice_url={row.original.invoice_url}
          />
          <Link href={row.original.invoice_url} target="_blank">
            <ArrowUpRightFromSquareIcon
              size={18}
              className="duration-300 text-black/50 hover:scale-110 hover:text-black"
            />
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <SortCell
          label="تاريخ الدفع"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center lg:w-12 whitespace-nowrap justify-start gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div>
        {row.original.payment_time
          ? format(new Date(row.original.payment_time), "EEEE, dd MMMM", {
              locale: arSA,
            })
          : "-"}
      </div>
    ),
  },

  // Status
  {
    accessorKey: "order_status",
    header: ({ column }) => {
      return (
        <SortCell
          label="حالة الطلب"
          isAscSorted={column.getIsSorted() === "asc"}
          className="flex items-center !lg:w-12 whitespace-nowrap gap-1 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const status = row.original.order_status;
      return (
        <div className="flex items-center lg:w-20">
          <OrderStatusBadge status={status} className="whitespace-nowrap" />
        </div>
      );
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
      const [changeOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
      const router = useRouter();
      const orderId = row.original.id;

      const handleStatusChange = (
        newStatus: OrderStatusEnum,
        tracking_url?: string,
        tracking_number?: string
      ) => {
        handleReqWithToaster("جاري تحديث حالة الطلب", async () => {
          await changeOrderStatus({
            id: orderId,
            order_status: newStatus,
            tracking_url,
            tracking_number,
          });
        });
      };

      return (
        <div className="flex-center">
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                icon={<EllipsisVertical />}
                className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <OrderStatusDropdown
                status={row.original.order_status}
                handleStatusChange={handleStatusChange}
                orderId={orderId}
              />

              <DropdownMenuItem className="!p-3">
                <PrintInvoice order={row.original} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <OrderDeliverySheet orderId={orderId}>
            <Button
              variant={"ghost"}
              icon={<Truck className="h-4 w-4" />}
              className="flex items-center gap-2 flex-row py-3 px-2 hover:bg-[#f5f5f5] cursor-pointer"
            />
          </OrderDeliverySheet>

          <OrderDetailsSheet order={row.original}>
            <Button
              variant={"ghost"}
              icon={<ReceiptText className="h-4 w-4" />}
              className="flex items-center gap-2 flex-row py-3 px-4 hover:bg-[#f5f5f5] cursor-pointer"
            />
          </OrderDetailsSheet>
        </div>
      );
    },
  },
];
