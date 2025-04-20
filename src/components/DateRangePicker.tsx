// components/DateRangePicker.tsx
"use client";
import { useState } from "react";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { useDateFilter } from "@/app/contexts/DataPickerContext";

export function DateRangePicker() {
  const { setDateRange, startDate, endDate } = useDateFilter();
  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startDate ?? undefined,
    to: endDate ?? undefined,
  });

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return;

    const newStart = range.from ?? null;
    const newEnd = range.to ?? null;

    setRange({ from: newStart ?? undefined, to: newEnd ?? undefined });
    setDateRange({ startDate: newStart, endDate: newEnd });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate && endDate
            ? `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
            : "Selecione um intervalo"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={{ from: startDate ?? undefined, to: endDate  ?? undefined }}
          onSelect={handleSelect}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}
