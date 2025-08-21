import { cn } from "@/lib/utils";

type StatusType = "success" | "processing" | "pending" | "failed";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function ProductStatusBadge({ status, className }: StatusBadgeProps) {
  const statusColorMap: Record<StatusType, string> = {
    success: "bg-green-100 text-green-800",
    processing: "bg-orange-100 text-orange-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  const statusTextMap: Record<StatusType, string> = {
    success: "مكتمل",
    processing: "قيد التنفيذ",
    pending: "قيد الانتظار",
    failed: "فشل",
  };

  // Default to failed styling if status is not recognized
  const colorClass =
    statusColorMap[status as StatusType] || "bg-red-100 text-red-800";
  const statusText = statusTextMap[status as StatusType] || "فشل";

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
