"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
  > {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "inline-flex items-center",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "h-4 w-4 appearance-none rounded-sm border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "checked:bg-primary checked:border-primary",
            className
          )}
          checked={!!checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        {/* Visual check mark using CSS pseudo elements would be ideal; keeping minimal here */}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
