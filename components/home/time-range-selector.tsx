"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export function TimeRangeSelector({
  value,
  options,
  onChange,
}: TimeRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="اختر المدة" />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value }, ix) => (
          <SelectItem key={ix} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
