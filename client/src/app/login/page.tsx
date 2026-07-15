import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text)]">
      <div className="relative grid min-h-screen lg:grid-cols-[0.86fr_1.14fr]">
        <div className="absolute right-5 top-5 z-30">
          <ThemeToggle />
        </div>

        <section className="relative z-10 flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-sm">
            <div className="mb-14 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-[#2d3748] shadow-sm">PD</div>
              <span className="text-sm font-bold tracking-wide text-[var(--text)]">PulseDeck</span>
            </div>

            <div className="mb-7">
              <h1 className="text-4xl font-bold tracking-tight text-[var(--text)]">Login</h1>
              <p className="mt-3 text-sm text-[var(--muted)]">Access your project workspace.</p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
              <LoginForm />
            </div>
          </div>
        </section>

        <section className="relative hidden items-center justify-center px-10 py-12 lg:flex">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute left-14 top-16 h-24 w-24 rounded-full bg-[var(--primary)]/45 blur-3xl" />
            <div className="absolute bottom-20 right-16 h-32 w-32 rounded-full bg-[var(--secondary)]/55 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-[48%] bg-[var(--primary)]/25" />
          </div>

          <div className="relative h-[520px] w-full max-w-3xl">
            <div className="absolute left-12 top-8 h-14 w-14 rounded-full border-4 border-[var(--primary)] bg-[var(--surface)] shadow-sm">
              <div className="absolute left-1/2 top-3 h-5 w-0.5 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
              <div className="absolute left-1/2 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
            </div>

            <div className="absolute left-24 top-28 h-72 w-72 rounded-[42%] bg-[var(--primary)]/35" />
            <div className="absolute right-16 top-16 h-32 w-40 rounded-[45%] bg-[var(--secondary)]/35" />
            <div className="absolute right-8 top-28 h-5 w-5 rounded-full bg-[var(--primary)]" />
            <div className="absolute left-40 top-20 h-5 w-5 rounded-full border-4 border-[var(--primary)]" />
            <div className="absolute left-16 top-32 h-3 w-3 rounded-full border-2 border-[var(--primary)]" />

            <div className="absolute bottom-16 left-20 h-36 w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
              <div className="mb-3 h-3 w-24 rounded-full bg-[var(--primary)]" />
              <div className="grid h-24 grid-cols-5 items-end gap-2">
                <div className="h-10 rounded-t-md bg-[var(--primary)]" />
                <div className="h-16 rounded-t-md bg-[var(--secondary)]" />
                <div className="h-8 rounded-t-md bg-[var(--accent)]" />
                <div className="h-20 rounded-t-md bg-[var(--primary)]" />
                <div className="h-12 rounded-t-md bg-[var(--secondary)]" />
              </div>
            </div>

            <div className="absolute bottom-28 left-56 h-3 w-72 rounded-full bg-[var(--border)]" />
            <div className="absolute bottom-31 left-64 h-28 w-52 rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
              <div className="mx-auto mt-4 h-3 w-24 rounded-full bg-[var(--primary)]" />
              <div className="mx-auto mt-3 h-3 w-32 rounded-full bg-[var(--border)]" />
              <div className="mx-auto mt-3 h-3 w-20 rounded-full bg-[var(--border)]" />
            </div>

            <div className="absolute bottom-36 left-64">
              <div className="h-14 w-14 rounded-full bg-[var(--accent)]" />
              <div className="mx-auto h-24 w-16 rounded-t-3xl bg-[var(--primary)]" />
              <div className="mx-auto h-24 w-2 rounded-full bg-[#2d3748]" />
            </div>

            <div className="absolute bottom-32 right-16">
              <div className="h-14 w-14 rounded-full bg-[var(--accent)]" />
              <div className="mx-auto h-28 w-16 rounded-t-3xl bg-[var(--secondary)]" />
              <div className="mx-auto h-24 w-2 rounded-full bg-[#2d3748]" />
            </div>

            <div className="absolute bottom-36 right-40 h-72 w-[360px] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--accent)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--secondary)]" />
                <span className="h-3 w-3 rounded-full bg-[var(--primary)]" />
              </div>
              <div className="mt-6 grid grid-cols-[1fr_110px] gap-6">
                <div className="space-y-3">
                  <div className="h-4 w-36 rounded-full bg-[var(--primary)]" />
                  <div className="h-3 w-48 rounded-full bg-[var(--border)]" />
                  <div className="h-3 w-40 rounded-full bg-[var(--border)]" />
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-12 rounded-xl bg-[var(--surface-soft)]" />
                    <div className="h-12 rounded-xl bg-[var(--surface-soft)]" />
                    <div className="h-12 rounded-xl bg-[var(--surface-soft)]" />
                    <div className="h-12 rounded-xl bg-[var(--surface-soft)]" />
                  </div>
                </div>
                <div>
                  <div className="h-28 w-28 rounded-full border-[18px] border-[var(--primary)] border-r-[var(--accent)]" />
                  <div className="mt-5 space-y-2">
                    <div className="h-2 rounded-full bg-[var(--border)]" />
                    <div className="h-2 w-3/4 rounded-full bg-[var(--border)]" />
                    <div className="h-2 w-1/2 rounded-full bg-[var(--border)]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-16 right-32 h-20 w-20 rounded-xl bg-[var(--secondary)] shadow-sm" />
            <div className="absolute bottom-16 right-24 h-12 w-12 rounded-xl bg-[var(--accent)] shadow-sm" />
          </div>
        </section>
      </div>
    </main>
  );
}
