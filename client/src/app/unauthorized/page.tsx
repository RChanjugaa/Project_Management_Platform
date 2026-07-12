import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <section className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Unauthorized</h1>
        <p className="mt-3 text-slate-600">Your account does not have permission to view that page.</p>
        <Link href="/login" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          Back to login
        </Link>
      </section>
    </main>
  );
}
