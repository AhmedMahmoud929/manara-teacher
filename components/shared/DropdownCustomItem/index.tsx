import { cn } from "@/lib/utils";
import React from "react";

function DropdownCustomItem({
  icon,
  text,
  variant = "default",
}: {
  icon: React.ReactNode;
  text: string;
  variant?: "default" | "danger";
}) {
  return (
    <div
      className={cn(
        "cursor-pointer flex-center gap-2 pr-1 pl-8 py-1.5 rounded-md",
        variant === "default"
          ? "hover:bg-zinc-50"
          : "text-red-600 hover:bg-red-50/50"
      )}
    >
      <span className="text-sm">{text}</span>
      {icon}
    </div>
  );
}

export default DropdownCustomItem;
