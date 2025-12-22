import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
interface CalendarInputProps {
  date?: Date | null;
  setDate: (date: Date | undefined) => void;
  onError?: (errorMessage: string | null) => void;
}
function formatDate(date: Date | undefined | null) {
  if (!date) {
    return ""
  }
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - (offset * 60 * 1000))
  return localDate.toISOString().split('T')[0]
}
function isValidDate(dateStr: string | undefined): string | null {
  if (!dateStr) return "Date is required";

  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateStr)) {
    return "Format must be YYYY-MM-DD";
  }

  const inputDate = new Date(dateStr);
  if (isNaN(inputDate.getTime())) {
    return "Invalid calendar date";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const comparisonDate = new Date(inputDate);
  comparisonDate.setHours(0, 0, 0, 0);

  if (comparisonDate > today) {
    return "Date cannot be in the future";
  }
  
  if (comparisonDate < new Date("1900-01-01")) {
    return "Date is too far in the past";
  }

  return null;
}
//TODO: Fix When Clicking in the calender disabled dates throws error 
export function CalendarInput({ date, setDate, onError }: CalendarInputProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined | null>(date)
  const [value, setValue] = React.useState(formatDate(date))

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);

    const error = isValidDate(val);

    if (onError) onError(error);

    if (!error) {
      const parsedDate = new Date(val);
      setDate(parsedDate);
      setMonth(parsedDate);
    } else {
      onError?.(error);
      setDate(undefined);
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="date" className="px-1">
        Dated On
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={formatDate(new Date())}
          className="bg-background pr-10"
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date ?? undefined}
              captionLayout="dropdown"
              month={month ?? undefined}
              onMonthChange={setMonth}
              fixedWeeks
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              onSelect={(date) => {
                if (!date) return;
                setDate(date = new Date(formatDate(date)))
                setValue(formatDate(date))
                onError?.(null);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
