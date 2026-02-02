"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
    value: number;
    onChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ className, value, onChange, ...props }, ref) => {
        // Format number to IDR string
        const formatValue = (val: number) => {
            if (!val && val !== 0) return "";
            return new Intl.NumberFormat("id-ID", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(val);
        };

        const [displayValue, setDisplayValue] = React.useState(formatValue(value));

        // Update display value when external value changes
        React.useEffect(() => {
            if (value !== undefined) {
                setDisplayValue(formatValue(value));
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            // Remove non-digit characters
            const numericString = inputValue.replace(/\D/g, "");

            // Convert to number
            const newValue = numericString ? parseInt(numericString, 10) : 0;

            // Update parent with number
            onChange(newValue);

            // Update local display with formatting
            // We rely on the useEffect to sync formatting if needed, but for smooth typing
            // we might want to update display immediately if we want to force format on type
            // but usually formatting on blur or simple display update is safer.
            // However user asks for "format directly while typing"

            setDisplayValue(formatValue(newValue));
        };

        return (
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    Rp
                </span>
                <Input
                    {...props}
                    ref={ref}
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    className={cn(
                        "pl-12 text-xl font-black text-slate-800",
                        className
                    )}
                />
            </div>
        );
    }
);

CurrencyInput.displayName = "CurrencyInput";
