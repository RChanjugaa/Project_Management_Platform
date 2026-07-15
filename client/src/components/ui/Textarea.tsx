import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ id, label, className = "", ...props }: TextareaProps) {
  const textareaId = id ?? props.name;
  return (
    <div className="space-y-2">
      <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`min-h-24 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 ${className}`}
        {...props}
      />
    </div>
  );
}
