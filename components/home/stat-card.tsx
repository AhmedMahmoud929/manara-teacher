import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  value: number | string | undefined | null;
  unit: string;
  label: string;
  isLoading: boolean;
}

export function StatCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  value,
  unit,
  label,
  isLoading,
}: StatCardProps) {
  return (
    <Card className="border rounded-xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-start mb-4">
          <div className={`${iconBgColor} p-3 rounded-lg`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
        <div className="flex items-end gap-2">
          {!isLoading && !!value ? (
            <div className="text-3xl font-bold">{value}</div>
          ) : (
            <Skeleton className={`h-4 w-20 mb-1.5 ${iconBgColor}`} />
          )}
          <div className="text-muted-foreground text-sm mb-1">{unit}</div>
        </div>
        <div className="text-muted-foreground text-lg">{label}</div>
      </CardContent>
    </Card>
  );
}
