"use client";

import { FormEvent, useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/Select";
import { workspaceApi } from "@/services/workspace.service";
import type { AuthUser } from "@/types/auth";

export function UsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", systemRole: "USER" as "ADMIN" | "USER", status: "ACTIVE" as "ACTIVE" | "INACTIVE" });

  async function loadUsers() {
    setError(null);
    setIsLoading(true);
    try {
      const userResult = await workspaceApi.users();
      setUsers(userResult.users);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      if (editingId) {
        const payload = { ...form, password: form.password || undefined };
        await workspaceApi.updateUser(editingId, payload);
        setMessage("User updated.");
      } else {
        await workspaceApi.createUser(form);
        setMessage("User created.");
      }
      setEditingId(null);
      setForm({ name: "", email: "", password: "", systemRole: "USER", status: "ACTIVE" });
      await loadUsers();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save user.");
    }
  }

  function editUser(user: AuthUser) {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "", systemRole: user.systemRole, status: user.status });
  }

  if (isLoading) return <LoadingSpinner label="Loading users" />;

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error" message={error} /> : null}
      {message ? <Alert variant="success" message={message} /> : null}

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
        <div className="border-b border-[var(--border)]/60 bg-[var(--surface-soft)]/60 px-5 py-5 sm:px-7">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--text)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.4-3.2 2.2-5 5.5-5s5.1 1.8 5.5 5M17 8v6M14 11h6" strokeLinecap="round"/></svg>
            </div>
            <div><h2 className="text-xl font-bold tracking-tight text-[var(--text)]">{editingId ? "Edit user account" : "Create a new user"}</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{editingId ? "Update account details without changing project memberships." : "Add a secure account and choose its system-level access."}</p></div>
          </div>
        </div>
        <form onSubmit={saveUser} className="grid gap-x-5 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
          <Input label="Full name" name="fullName" placeholder="e.g. Alex Johnson" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input label="Work email" name="userEmail" type="email" placeholder="alex@company.com" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <div className="space-y-2">
            <label htmlFor="userPassword" className="block text-sm font-medium text-[var(--text)]">{editingId ? "New password" : "Temporary password"}</label>
            <div className="relative"><input id="userPassword" type={showPassword ? "text" : "password"} placeholder={editingId ? "Leave blank to keep current password" : "Minimum 8 characters"} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required={!editingId} minLength={8} className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 pr-12 text-[var(--text)] shadow-sm outline-none transition placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/15"/><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-soft)]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3l18 18M10.7 10.7a2 2 0 002.6 2.6M6.5 6.5C4.2 8 3 10 3 10s3.5 5 9 5c1 0 2-.2 2.8-.5M10 5.2c.6-.1 1.3-.2 2-.2 5.5 0 9 5 9 5s-.7 1.2-2 2.4" strokeLinecap="round"/></svg> : <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5z"/><circle cx="12" cy="12" r="2.5"/></svg>}</button></div>
            <p className="text-xs text-[var(--muted)]">Use at least 8 characters. The password is stored securely as a hash.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Select label="System role" value={form.systemRole} onChange={(event) => setForm({ ...form, systemRole: event.target.value as "ADMIN" | "USER" })}><option value="USER">Standard user</option><option value="ADMIN">Administrator</option></Select><p className="mt-2 text-xs text-[var(--muted)]">Project roles are assigned separately.</p></div>
            <div><Select label="Account status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "ACTIVE" | "INACTIVE" })}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select><p className="mt-2 text-xs text-[var(--muted)]">Inactive users cannot sign in.</p></div>
          </div>
          <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--border)]/50 pt-5 sm:col-span-2">
            {editingId ? <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setShowPassword(false); }}>Cancel</Button> : null}
            <Button type="submit" className="min-w-32 rounded-xl">{editingId ? "Save changes" : "Create user"}</Button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm sm:p-7">
        <div><h2 className="text-xl font-bold text-[var(--text)]">Team directory</h2><p className="mt-1 text-sm text-[var(--muted)]">Manage system access and account availability.</p></div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-soft)] text-[var(--text)]">
              <tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)]/40">
                  <td className="p-3 font-medium">{user.name}</td><td>{user.email}</td><td><span className="rounded-full bg-[var(--primary)]/25 px-2.5 py-1 text-xs font-semibold">{user.systemRole === "ADMIN" ? "Administrator" : "Standard user"}</span></td><td><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "ACTIVE" ? "bg-[var(--secondary)]/35" : "bg-[var(--accent)]/30"}`}>{user.status === "ACTIVE" ? "Active" : "Inactive"}</span></td>
                  <td className="flex gap-2 py-2">
                    <Button variant="secondary" onClick={() => editUser(user)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
