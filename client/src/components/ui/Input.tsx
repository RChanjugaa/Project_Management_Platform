import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ id, label, error, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-[#2d3748]">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-md border border-[#a7d8de] bg-white px-3 py-2 text-[#2d3748] shadow-sm outline-none transition placeholder:text-[#2d3748]/45 focus:border-[#ffb4a2] focus:ring-2 focus:ring-[#ffb4a2]/30 ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
