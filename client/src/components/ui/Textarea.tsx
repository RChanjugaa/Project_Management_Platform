import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ id, label, className = "", ...props }: TextareaProps) {
  const textareaId = id ?? props.name;
  return (
    <div className="space-y-2">
      <label htmlFor={textareaId} className="block text-sm font-medium text-[#2d3748]">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`min-h-24 w-full rounded-md border border-[#a7d8de] bg-white px-3 py-2 text-[#2d3748] outline-none focus:border-[#ffb4a2] focus:ring-2 focus:ring-[#ffb4a2]/30 ${className}`}
        {...props}
      />
    </div>
  );
}
