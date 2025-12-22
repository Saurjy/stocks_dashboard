import { useState, useEffect } from "react"
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
import { toast } from "sonner"
import { userService } from "@/services/useRequestData"

type AddHoldingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}


interface FormPayload {
  symbol: string;
  company: string;
  quantity: string | null;
  investment: string | null;
  dated_on: Date | null;
}

const initialFormState: FormPayload = {
  symbol: "",
  company: "",
  quantity: null,
  investment: null,
  dated_on: null,
};

interface FormErrors {
  symbol?: string | null;
  company?: string | null;
  quantity?: string | null;
  investment?: string | null;
  dated_on?: string | null;
}

const validate = (data: FormPayload, errors: FormErrors): FormErrors => {
  const currenterrors:FormErrors = {};

  if (!data.symbol.trim()) {
    currenterrors.symbol = "Symbol is required";
  }

  if (!data.company) {
    currenterrors.company = "Company is required";
  }

  if (!data.quantity) {
    currenterrors.quantity = "Quantity is required";
  }

  if (!data.investment) {
    currenterrors.investment = "Investment is required";
  }

  if (currenterrors.dated_on) {
    currenterrors.dated_on = errors.dated_on
  }
  else if (!data.dated_on) {
    currenterrors.dated_on = "Date is required";
  }

  return currenterrors;
};


export function AddHoldingModal({ open, onOpenChange }: AddHoldingModalProps) {

  const [formData, setFormData] = useState<FormPayload>(initialFormState);
  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [open]);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      dated_on: date ?? null,
    }));
  };

  const handleDateError = (error: string | undefined) => {
    setErrors(prev => ({
      ...prev,
      dated_on: error || undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData, errors);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.warning("Please Correct the errors in the Form")
      return
    };

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      investment: Number(formData.investment),
      dated_on: formData.dated_on!.toISOString(),
    };

    onOpenChange(false);

    toast.promise(userService.addHolding(payload), {
      loading: "Submitting request...",
      success: "Request submitted successfully",
      error: (err) => {
        return err.response?.data?.message ||
        err?.message ||
        "Failed to submit holding";
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Stock Holding</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Symbol */}
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="AAPL"
            />
            {errors.symbol && <p className="text-sm text-red-500">{errors.symbol}</p>}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Apple Inc."
            />
            {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
          </div>

          {/* Quantity */}
          <div>
            <Label htmlFor="quantity">Quantity Held</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity ?? ""}
              onChange={handleChange}
              placeholder="100"
            />
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
          </div>

          {/* Date */}

          <div>
          <CalendarInput
            date={formData.dated_on}
            setDate={handleDateChange as (date: Date | undefined) => void}
            onError={handleDateError as (error: string | undefined | null) => void}
          />
          {errors.dated_on && (
            <p className="text-sm text-red-500">{errors.dated_on}</p>
          )}
          </div>

          {/* Investment */}
          <div>
            <Label htmlFor="investment">Investment Value</Label>
            <Input
              id="investment"
              name="investment"
              type="number"
              value={formData.investment ?? ""}
              onChange={handleChange}
              placeholder="₹50,000"
            />
            {errors.investment && (
              <p className="text-sm text-red-500">{errors.investment}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="outline">Save Holding</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

