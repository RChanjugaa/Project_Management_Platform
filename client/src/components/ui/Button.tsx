import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const variants = {
  primary: "bg-slate-950 text-white hover:bg-slate-800 focus-visible:outline-slate-950",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:outline-slate-700",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-700"
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
