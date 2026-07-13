import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ id, label, className = "", children, ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="block text-sm font-medium text-[#2d3748]">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-md border border-[#a7d8de] bg-white px-3 py-2 text-[#2d3748] outline-none focus:border-[#ffb4a2] focus:ring-2 focus:ring-[#ffb4a2]/30 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
