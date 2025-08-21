"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatusEnum } from "@/types/(waraqah)/order";
import { Pen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

function OrderStatusDropdown({
  handleStatusChange,
  orderId,
  status,
}: {
  handleStatusChange: (status: OrderStatusEnum) => void;
  orderId: number;
  status: OrderStatusEnum;
}) {
  const STATUS_TEXT: Record<OrderStatusEnum, string> = {
    pending: "قيد الانتظار",
    cancelled: "تم الإلغاء",
    shipped: "تم الشحن",
    confirmed: "تم التأكيد",
  };

  const STATUS_COLOR: Record<OrderStatusEnum, string> = {
    pending: "bg-amber-400 text-amber-800",
    cancelled: "bg-red-400 text-red-800",
    shipped: "bg-green-400 text-green-800",
    confirmed: "bg-blue-400 text-blue-800",
  };

  const RenderStatusItem = ({
    supposedStatus,
  }: {
    supposedStatus: OrderStatusEnum;
  }) => {
    const isShipping = supposedStatus === "shipped";

    const CoreComp = () => (
      <div className="flex items-center gap-2">
        <div
          className={`rounded-full cursor-pointer ${
            supposedStatus === status
              ? STATUS_COLOR[supposedStatus] + " h-3 w-3"
              : "bg-black h-1.5 w-1.5"
          }`}
        />
        <span
          className={cn(
            "text-sm",
            supposedStatus === status ? "font-bold" : ""
          )}
        >
          {STATUS_TEXT[supposedStatus]}
        </span>
      </div>
    );

    return isShipping ? (
      <div
        className="px-2 py-1.5 cursor-pointer"
        onClick={() => toast("من فضلك قم بتعديل بيانات التتبع أولاً")}
      >
        <CoreComp />
      </div>
    ) : (
      <DropdownMenuItem onClick={() => handleStatusChange(supposedStatus)}>
        <CoreComp />
      </DropdownMenuItem>
    );
  };

  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer w-full hover:bg-gray-100 !p-3 rounded-sm">
            <Pen className="h-4 w-4" />
            <span>تغيير الحالة</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-36"
          side="right"
          sideOffset={10}
          align="start"
        >
          <RenderStatusItem supposedStatus="pending" />
          <RenderStatusItem supposedStatus="shipped" />
          <RenderStatusItem supposedStatus="confirmed" />
          <RenderStatusItem supposedStatus="cancelled" />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default OrderStatusDropdown;
