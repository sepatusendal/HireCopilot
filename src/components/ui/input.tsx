import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border bg-card px-4 text-sm text-foreground shadow-brutal-sm outline-none transition-shadow placeholder:text-muted-foreground focus-visible:shadow-brutal disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
