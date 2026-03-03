import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      icon,
      rightIcon,
      onRightIconClick,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-800 transition-all outline-none",
              "placeholder:text-[#fdeee7]",
              "focus:border-[#ec5b13] focus:ring-2 focus:ring-[#ec5b13]/20",
              icon && "pl-11",
              rightIcon && "pr-11",
              error &&
                "border-red-400 focus:border-red-500 focus:ring-red-500/20",
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && <p className="px-2 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
