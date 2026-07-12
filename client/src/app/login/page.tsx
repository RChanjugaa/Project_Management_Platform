import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Project and Team Task Management</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">Sign in to your workspace</h1>
            <p className="mt-3 text-slate-600">Access is controlled by the backend with secure HTTP-only cookies and role-based authorization.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <LoginForm />
          </div>
        </div>
      </section>
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-2xl font-bold">TaskFlow PM</p>
          <p className="mt-4 max-w-lg text-slate-300">A practical full-stack platform foundation for administrators, project managers, and delivery teams.</p>
        </div>
        <div className="grid gap-4">
          {["Secure authentication", "Role dashboards", "Prisma MySQL model", "CI validation"].map((item) => (
            <div key={item} className="rounded-md border border-white/15 bg-white/5 p-4">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
