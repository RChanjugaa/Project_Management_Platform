"use client";

import { FormEvent, useEffect, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/Select";
import { workspaceApi } from "@/services/workspace.service";
import type { AuthUser } from "@/types/auth";
import type { Role } from "@/types/domain";

export function UsersPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", roleId: 0, status: "ACTIVE" as "ACTIVE" | "INACTIVE" });

  async function loadUsers() {
    setError(null);
    setIsLoading(true);
    try {
      const [roleResult, userResult] = await Promise.all([workspaceApi.roles(), workspaceApi.users()]);
      setRoles(roleResult.roles);
      setUsers(userResult.users);
      setForm((current) => ({ ...current, roleId: current.roleId || roleResult.roles[0]?.id || 0 }));
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
      setForm({ name: "", email: "", password: "", roleId: roles[0]?.id ?? 0, status: "ACTIVE" });
      await loadUsers();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save user.");
    }
  }

  function editUser(user: AuthUser) {
    const role = roles.find((item) => item.name === user.role);
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "", roleId: role?.id ?? roles[0]?.id ?? 0, status: user.status });
  }

  if (isLoading) return <LoadingSpinner label="Loading users" />;

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error" message={error} /> : null}
      {message ? <Alert variant="success" message={message} /> : null}

      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--text)]">{editingId ? "Edit User" : "Create User"}</h2>
        <form onSubmit={saveUser} className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label={editingId ? "New Password" : "Password"} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required={!editingId} />
          <Select label="Role" value={form.roleId} onChange={(event) => setForm({ ...form, roleId: Number(event.target.value) })}>
            {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
          </Select>
          <Select label="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as "ACTIVE" | "INACTIVE" })}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </Select>
          <div className="flex gap-2 self-end">
            <Button type="submit">{editingId ? "Update" : "Create"}</Button>
            {editingId ? <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button> : null}
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--text)]">Users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-soft)] text-[var(--text)]">
              <tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--border)]/40">
                  <td className="p-3 font-medium">{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.status}</td>
                  <td className="flex gap-2 py-2">
                    <Button variant="secondary" onClick={() => editUser(user)}>Edit</Button>
                    <Button variant="secondary" onClick={() => void workspaceApi.deactivateUser(user.id).then(loadUsers)}>Deactivate</Button>
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
