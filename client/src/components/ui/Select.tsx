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
        className={`w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
