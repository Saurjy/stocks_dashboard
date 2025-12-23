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
import { motion, AnimatePresence } from "framer-motion";

type AddHoldingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const containerVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12, // delay between items
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    height: 0,
  },
  show: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    height: 0,
    transition: {
      duration: 0.2,
    },
  },
};


interface FormPayload {
  symbol: string;
  company: string;
  mystocks: boolean;
  quantity: string | null;
  investment: string | null;
  dated_on: Date | null;
}

const initialFormState: FormPayload = {
  symbol: "",
  company: "",
  mystocks: false,
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
  const currenterrors: FormErrors = {};

  if (!data.symbol.trim()) {
    currenterrors.symbol = "Symbol is required";
  }

  if (!data.company) {
    currenterrors.company = "Company is required";
  }

  if (data.mystocks) {
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
  }

  return currenterrors;
};


export function AddHoldingModal({ open, onOpenChange }: AddHoldingModalProps) {

  const [formData, setFormData] = useState<FormPayload>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [open]);


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

    let payload: any = {
      symbol: String(formData.symbol),
      company: String(formData.company),
      mystocks: Boolean(formData.mystocks),
    };
    if (formData.mystocks) {
      payload.quantity = Number(formData.quantity);
      payload.investment = Number(formData.investment);
      payload.dated_on = formData.dated_on!.toISOString();
    }

    console.log("Form Data = ", formData, "\nPayload = ", payload)

    setIsSubmitting(true);
    toast.promise(userService.addHolding(payload), {
      loading: "Submitting request...",
      success: () => {
        setIsSubmitting(false);
        onOpenChange(false); // <--- Close it HERE
        return "Request submitted successfully!";
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.response?.data?.message ||
          err?.customMessage ||
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

          <div className="space-y-2">
            <Label>Stock Status</Label>

            <div className="flex rounded-lg border p-1 bg-muted">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, mystocks: true })}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition-all
        ${formData.mystocks === true
                    ? "bg-background shadow font-medium"
                    : "text-muted-foreground"
                  }`}
              >
                I Own this Stock
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, mystocks: false })}
                className={`flex-1 rounded-md px-3 py-2 text-sm transition-all
        ${formData.mystocks === false
                    ? "bg-background shadow font-medium"
                    : "text-muted-foreground"
                  }`}
              >
                I Do Not Own this Stock
              </button>
            </div>
          </div>


          {/* Quantity */}
          <AnimatePresence>
            {formData.mystocks && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="space-y-4"
              >
                {/* Quantity */}
                <motion.div variants={itemVariants}>
                  <Label htmlFor="quantity">Quantity Held</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity ?? ""}
                    onChange={handleChange}
                    placeholder="100"
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity}</p>
                  )}
                </motion.div>

                {/* Date */}
                <motion.div variants={itemVariants}>
                  <CalendarInput
                    date={formData.dated_on}
                    setDate={handleDateChange as (date: Date | undefined) => void}
                    onError={handleDateError as (error: string | undefined | null) => void}
                  />
                  {errors.dated_on && (
                    <p className="text-sm text-red-500">{errors.dated_on}</p>
                  )}
                </motion.div>

                {/* Investment */}
                <motion.div variants={itemVariants}>
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting} // <-- This prevents double clicks
              variant="outline"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

