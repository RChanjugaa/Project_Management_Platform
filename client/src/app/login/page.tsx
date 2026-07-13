import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#f7fafc] lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2d3748]/65">Project and Team Task Management</p>
            <h1 className="mt-3 text-3xl font-bold text-[#2d3748]">Sign in to your workspace</h1>
            <p className="mt-3 text-[#2d3748]/70">Manage users, projects, assignments and task progress from one focused workspace.</p>
          </div>
          <div className="rounded-lg border border-[#a7d8de] bg-white p-6 shadow-sm">
            <LoginForm />
          </div>
        </div>
      </section>
      <section className="hidden bg-[#a7d8de] p-10 text-[#2d3748] lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-2xl font-bold">TaskFlow PM</p>
          <p className="mt-4 max-w-lg text-[#2d3748]/75">A clean full-stack platform for administrators, project managers, and team members.</p>
        </div>
        <div className="grid gap-4">
          {["Secure authentication", "Role-based access", "Project assignments", "Task progress tracking"].map((item) => (
            <div key={item} className="rounded-md border border-white/40 bg-white/35 p-4">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
