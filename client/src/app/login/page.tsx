import { LoginForm } from "@/components/auth/LoginForm";

const highlights = [
  { label: "Admin control", value: "Users + roles" },
  { label: "Manager flow", value: "Projects + tasks" },
  { label: "Member focus", value: "Progress updates" }
];

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fafc] text-[#2d3748]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex items-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="absolute left-8 top-8 h-16 w-16 rounded-[18px] border border-[#a7d8de] bg-white shadow-sm" aria-hidden="true">
            <div className="m-3 h-10 rounded-xl bg-[#b8e0d2]" />
          </div>
          <div className="mx-auto w-full max-w-xl pt-20 lg:pt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2d3748]/60">Project and Team Task Management</p>
            <h1 className="mt-4 max-w-lg text-4xl font-bold leading-tight text-[#2d3748] sm:text-5xl">
              A calm command center for project work.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-[#2d3748]/72">
              Sign in to manage teams, assign work, and keep task progress visible without clutter.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-lg border border-[#a7d8de] bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#2d3748]/55">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-[#2d3748]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center bg-[#a7d8de] px-6 py-10 sm:px-10">
          <div className="absolute inset-0 opacity-45" aria-hidden="true">
            <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:42px_42px]" />
          </div>

          <div className="relative w-full max-w-md">
            <div className="mb-5 rounded-lg border border-white/60 bg-white/45 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#2d3748]">PulseDesk PM</p>
                  <p className="text-xs text-[#2d3748]/65">Secure role workspace</p>
                </div>
                <span className="rounded-full bg-[#ffb4a2] px-3 py-1 text-xs font-semibold text-[#2d3748]">RBAC</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-2 rounded-full bg-white" />
                <div className="h-2 rounded-full bg-[#b8e0d2]" />
                <div className="h-2 rounded-full bg-[#ffb4a2]" />
              </div>
            </div>

            <div className="rounded-[18px] border border-white/70 bg-white p-6 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2d3748]">Welcome back</h2>
                <p className="mt-2 text-sm text-[#2d3748]/68">Use your seeded admin, manager, or member account.</p>
              </div>
              <LoginForm />
            </div>

            <div className="mt-5 rounded-lg border border-white/55 bg-white/35 p-4 text-sm text-[#2d3748]/75 backdrop-blur">
              Backend authorization decides access. The frontend only guides users to the correct dashboard.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
