export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#2d3748]/70" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#b8e0d2] border-t-[#ffb4a2]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
