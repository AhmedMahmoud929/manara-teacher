import { cn } from "@/lib/utils";
import { OrderStatusEnum } from "@/types/(waraqah)/order";

interface StatusBadgeProps {
  status: OrderStatusEnum;
  className?: string;
}

export function OrderStatusBadge({ status, className }: StatusBadgeProps) {
  const statusColorMap: Record<OrderStatusEnum, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800", // Added for confirmed
    shipped: "bg-green-100 text-green-800", // Added for shipped
    cancelled: "bg-red-100 text-red-800", // Changed from 'canceled' to 'cancelled'
    // 'completed' is removed as it's not in the new list of statuses
  };

  const statusTextMap: Record<OrderStatusEnum, string> = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد", // Added for confirmed
    shipped: "تم الشحن", // Added for shipped
    cancelled: "ملغي", // Changed from 'canceled' to 'cancelled'
    // 'completed' is removed as it's not in the new list of statuses
  };

  // Default to failed styling if status is not recognized
  const colorClass =
    statusColorMap[status as OrderStatusEnum] || "bg-gray-100 text-gray-800"; // Default to a neutral/error color
  const statusText = statusTextMap[status as OrderStatusEnum] || "غير معروف"; // Default to a generic "unknown" text

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium",
        colorClass,
        className
      )}
    >
      {statusText}
    </span>
  );
}
