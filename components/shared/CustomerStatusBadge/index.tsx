import { cn } from "@/lib/utils";

type StatusType = "active" | "inactive";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function CustomerStatusBadge({ status, className }: StatusBadgeProps) {
  const statusColorMap: Record<StatusType, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-yellow-100 text-yellow-800",
  };

  const statusTextMap: Record<StatusType, string> = {
    active: "مُفعل",
    inactive: "لم يتم التفعيل",
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
