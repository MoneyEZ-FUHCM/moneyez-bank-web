"use client";

import * as React from "react";
import { cn } from "@/helpers/libs/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const TextareaCustom = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, placeholder, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="relative w-full">
        <label
          className={cn(
            "text-muted-foreground absolute left-3 top-[20%] -translate-y-1/2 transform text-sm transition-all duration-500",
            isFocused || props.value
              ? "left-2 top-0 bg-superlight px-1 text-xs text-primary"
              : "text-gray-500",
          )}
        >
          {placeholder}
        </label>
        <textarea
          className={cn(
            "flex min-h-[60px] w-full rounded-[6px] border !bg-superlight bg-transparent px-3 py-2 text-sm placeholder-transparent shadow-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-500"
              : isFocused || props.value
                ? "border-primary"
                : "border-gray-300",
            className,
          )}
          placeholder={placeholder}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
    );
  },
);

TextareaCustom.displayName = "TextareaCustom";

export { TextareaCustom };
