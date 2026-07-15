import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const variants = {
  primary: "bg-[var(--accent)] text-[#2d3748] hover:brightness-95 focus-visible:outline-[var(--accent)]",
  secondary: "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-soft)] focus-visible:outline-[var(--primary)]",
  danger: "bg-[var(--accent)] text-[#2d3748] hover:brightness-95 focus-visible:outline-[var(--accent)]"
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      {...props}
      type={props.type ?? "button"}
    />
  );
}
