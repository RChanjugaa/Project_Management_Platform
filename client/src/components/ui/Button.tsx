import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const variants = {
  primary: "bg-[#ffb4a2] text-[#2d3748] hover:bg-[#ffa28d] focus-visible:outline-[#ffb4a2]",
  secondary: "border border-[#a7d8de] bg-white text-[#2d3748] hover:bg-[#f7fafc] focus-visible:outline-[#a7d8de]",
  danger: "bg-[#ffb4a2] text-[#2d3748] hover:bg-[#ffa28d] focus-visible:outline-[#ffb4a2]"
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
