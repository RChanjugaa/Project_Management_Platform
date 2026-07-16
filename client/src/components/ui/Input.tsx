import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ id, label, error, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      <input
        id={inputId}
        className={`h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--text)] shadow-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15 ${className}`}
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
