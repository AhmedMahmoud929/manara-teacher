import { cn } from "@/lib/utils";
import { OrderPaymentStatusEnum } from "@/types/(waraqah)/order";

interface OrderPaymentStatusBadgeProps {
  status: OrderPaymentStatusEnum;
  className?: string;
  invoice_url: string;
}

export function OrderPaymentStatusBadge({
  status,
  invoice_url,
  className,
}: OrderPaymentStatusBadgeProps) {
  const statusColorMap: Record<OrderPaymentStatusEnum, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
  };

  const statusTextMap: Record<OrderPaymentStatusEnum, string> = {
    pending: "قيد الانتظار",
    paid: "تم الدفع",
    expired: "انتهت صلاحية الدفع",
  };

  // Default to failed styling if status is not recognized
  const colorClass =
    statusColorMap[status as OrderPaymentStatusEnum] ||
    "bg-red-100 text-red-800";
  const statusText = statusTextMap[status as OrderPaymentStatusEnum] || "فشل";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium",
        colorClass,
        className
      )}
    >
      <a href={invoice_url} target="_blank">
        {statusText}
      </a>
    </span>
  );
}
