import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { CalendarInput } from "../calendar/Calendar-With-Input"

type AddHoldingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddHoldingModal({
  open,
  onOpenChange,
}: AddHoldingModalProps) {
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
          <CalendarInput/>

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
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="outline" >
              Save Holding
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
