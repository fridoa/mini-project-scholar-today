import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  isLoading?: boolean;
  children: ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  icon,
  isLoading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-[#ec5b13] text-white hover:bg-[#d44f0e] active:bg-[#c0470c]",
    outline:
      "border-2 border-[#ec5b13] text-[#ec5b13] bg-transparent hover:bg-[#ec5b13]/5 active:bg-[#ec5b13]/10",
    ghost: "text-[#ec5b13] bg-transparent hover:bg-[#ec5b13]/5 active:bg-[#ec5b13]/10",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-sm",
    lg: "px-9 py-3.5 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export default Button;
