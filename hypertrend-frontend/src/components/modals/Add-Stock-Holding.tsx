import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

type AddHoldingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddHoldingModal({
  open,
  onOpenChange,
}: AddHoldingModalProps) {
  const [date, setDate] = useState<Date | undefined>()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Stock Holding</DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          {/* Symbol */}
          <div className="space-y-1">
            <Label htmlFor="symbol">Symbol</Label>
            <Input id="symbol" placeholder="AAPL" />
          </div>

          {/* Company */}
          <div className="space-y-1">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Apple Inc." />
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <Label htmlFor="quantity">Quantity Held</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="100"
            />
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <Label>Dated On</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Investment Value */}
          <div className="space-y-1">
            <Label htmlFor="investment">
              Investment Value (Optional)
            </Label>
            <Input
              id="investment"
              type="number"
              placeholder="₹50,000"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">
              Save Holding
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
