"use client";

import { ChevronDown, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SortDropdown({
  title,
  onChange,
  align = "start",
  className,
  sortOptions,
}: {
  title: string;
  onChange: (value: string) => void;
  align?: "start" | "center" | "end";
  className?: string;
  sortOptions: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [sortOpt, setSortOpt] = useState<string | null>(null);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex-center gap-2 border bg-gray-50 rounded-md py-1.5 pr-2 pl-8 whitespace-nowrap",
            sortOpt ? "text-green-700 border-green-700" : "text-black",
            className
          )}
        >
          <SortDesc className="h-4 w-4 opacity-60 mt-1" />
          {sortOpt
            ? sortOptions.find((s) => s.value === `${sortOpt}`)?.label
            : title}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-[240px]">
        <div className="text-right px-4 py-2 border-b text-16 font-medium ">
          {title}
        </div>
        <div>
          <RadioGroup
            value={sortOpt!}
            onValueChange={(newValue) => {
              onChange(newValue);
              setSortOpt(newValue);
              setOpen(false);
            }}
            className="gap-0"
          >
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className="relative flex items-center space-x-2 rtl:space-x-reverse py-2 px-2 rounded hover:bg-muted/50 cursor-pointer"
              >
                <label
                  className="absolute-center w-full h-full opacity-0"
                  htmlFor={option.label + option.value}
                >
                  {option.label}
                </label>
                <div className="flex-1 rtl:text-right">{option.label}</div>
                <RadioGroupItem
                  value={option.value}
                  id={option.label + option.value}
                  className="border-muted-foreground data-[state=checked]:border-[#30D5C8] data-[state=checked]:bg-[#30D5C8] data-[state=checked]:text-white"
                />
              </div>
            ))}
          </RadioGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
