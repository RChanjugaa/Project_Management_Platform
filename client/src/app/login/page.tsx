import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  return (
    <main className="login-canvas relative h-[100dvh] overflow-hidden p-3 text-[var(--text)] sm:p-5 lg:p-7">
      <div className="absolute right-5 top-5 z-30 sm:right-8 sm:top-7"><ThemeToggle /></div>

      <div className="relative mx-auto grid h-full max-w-[1500px] overflow-hidden rounded-[26px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_70px_rgba(45,55,72,.11)] lg:grid-cols-[0.86fr_1.14fr]">
        <section className="flex min-h-0 items-center justify-center overflow-y-auto px-6 py-6 sm:px-12 lg:px-14 xl:px-20">
          <div className="w-full max-w-[420px]">
            <div className="mb-8 flex items-center gap-3 xl:mb-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-extrabold shadow-sm">PD</div>
              <div><p className="font-extrabold tracking-tight">PulseDeck</p><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[var(--muted)]">Project workspace</p></div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--muted)]">Welcome back</p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-[-.04em] sm:text-5xl">Sign in</h1>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">Manage projects, organise tasks, and collaborate from one focused workspace.</p>
            </div>

            <LoginForm />
            <div className="mt-5 flex items-center gap-2 text-xs text-[var(--muted)]">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>
              <span>Secure access with encrypted credentials.</span>
            </div>
          </div>
        </section>

        <section className="relative hidden min-h-0 items-center justify-center overflow-hidden border-l border-[var(--border)]/40 bg-[linear-gradient(145deg,var(--surface-soft),var(--surface))] px-8 py-6 lg:flex">
          <div className="absolute left-[12%] top-[12%] h-64 w-64 rounded-full bg-[var(--primary)]/18 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] h-56 w-56 rounded-full bg-[var(--accent)]/12 blur-3xl" />
          <div className="relative flex h-full w-full max-w-[680px] flex-col items-center justify-center">
            <div className="relative h-[60vh] max-h-[570px] min-h-[360px] w-full overflow-hidden">
              <Image src="/images/login-illustration-transparent.png" alt="Professional working on project tasks using a laptop" fill sizes="(min-width: 1024px) 55vw, 0px" priority className="object-contain scale-[1.62]" />
            </div>
            <div className="-mt-4 max-w-md text-center"><h2 className="text-xl font-bold">Plan clearly. Work together.</h2><p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">Turn goals into organised, trackable teamwork.</p></div>
          </div>
        </section>
      </div>
    </main>
  );
}
