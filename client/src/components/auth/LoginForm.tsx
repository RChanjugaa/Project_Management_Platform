"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();
    await login({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? <Alert variant="error" title="Sign in failed" message={error} /> : null}
      <Input label="Email address" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-[var(--text)]">Password</label>
        <div className="relative">
          <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 pr-12 text-[var(--text)] shadow-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15" />
          <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
            {showPassword ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 3l18 18" strokeLinecap="round"/><path d="M10.6 10.7a2 2 0 002.7 2.7"/><path d="M9.9 4.4A10.8 10.8 0 0112 4c5.5 0 9 5.2 9 5.2a14 14 0 01-2.1 2.7M6.4 6.5C4.2 8 3 9.2 3 9.2s3.5 5.2 9 5.2c1 0 2-.2 2.8-.5"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 12s3.5-5.2 9-5.2S21 12 21 12s-3.5 5.2-9 5.2S3 12 3 12z"/><circle cx="12" cy="12" r="2.4"/></svg>
            )}
          </button>
        </div>
      </div>
      <Button type="submit" className="h-12 w-full rounded-xl text-base font-bold shadow-[0_10px_24px_rgba(255,180,162,.28)]" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
