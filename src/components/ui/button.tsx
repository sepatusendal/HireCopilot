import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-brutal)] border-[var(--border-width)] border-border text-sm font-bold transition-transform duration-100 disabled:pointer-events-none disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai",
  {
    variants: {
      variant: {
        primary: "bg-ai text-ai-foreground shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-lg",
        secondary: "bg-card text-foreground shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-lg",
        ghost: "border-transparent hover:bg-surface",
        destructive: "bg-rejection text-rejection-foreground shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-lg",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
