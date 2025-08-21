"use client";

import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { arSA } from "date-fns/locale";
import { useState } from "react";

export default function DateRangeFilter({
  className,
  defaultValue,
  onValueChange,
}: {
  className?: string;
  defaultValue: DateRange | undefined;
  onValueChange: (newVal: DateRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(defaultValue);

  const handleOpen = (newState: boolean) => {
    setOpen(newState);
    if (!newState && !!date?.from && !!date?.to) onValueChange(date);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "!text-[14px] text-wrap justify-start text-right font-normal rounded-md h-fit py-2 sm:py-0 sm:h-10 bg-gray-50 !text-black border-black/20",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "EEEE dd MMMM, yyyy", { locale: arSA })} -{" "}
                  {format(date.to, "EEEE dd MMMM, yyyy", { locale: arSA })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: arSA })
              )
            ) : (
              <span>اختر تاريخ</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            lang="arabic"
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
