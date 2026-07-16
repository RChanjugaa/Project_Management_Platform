import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ id, label, className = "", children, ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="block text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      <select
        id={selectId}
        className={`h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--text)] shadow-sm outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
