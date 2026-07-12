interface AlertProps {
  title?: string;
  message: string;
  variant?: "error" | "info" | "success";
}

const variants = {
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800"
};

export function Alert({ title, message, variant = "info" }: AlertProps) {
  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${variants[variant]}`} role={variant === "error" ? "alert" : "status"}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <p>{message}</p>
    </div>
  );
}
