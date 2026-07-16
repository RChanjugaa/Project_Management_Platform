"use client";
import { FormEvent, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/contexts/AuthContext";
import { workspaceApi } from "@/services/workspace.service";
export default function ProfilePage() {
  const { user, refreshUser } = useAuth(); const [name, setName] = useState(user?.name ?? ""); const [currentPassword, setCurrent] = useState(""); const [newPassword, setNew] = useState(""); const [message, setMessage] = useState<string | null>(null);
  const save = async (event: FormEvent) => { event.preventDefault(); await workspaceApi.updateProfile({ name }); await refreshUser(); setMessage("Profile updated."); };
  const password = async (event: FormEvent) => { event.preventDefault(); await workspaceApi.changePassword({ currentPassword, newPassword }); setCurrent(""); setNew(""); setMessage("Password changed."); };
  return <DashboardLayout title="My Profile"><div className="grid max-w-3xl gap-5 md:grid-cols-2">{message ? <div className="md:col-span-2"><Alert variant="success" message={message} /></div> : null}<form onSubmit={save} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"><h2 className="text-lg font-semibold">Profile</h2><div className="mt-4"><Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required /></div><Button className="mt-4">Save profile</Button></form><form onSubmit={password} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"><h2 className="text-lg font-semibold">Change password</h2><div className="mt-4 grid gap-3"><Input label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} required /><Input label="New password" type="password" minLength={8} value={newPassword} onChange={(e) => setNew(e.target.value)} required /></div><Button className="mt-4">Change password</Button></form></div></DashboardLayout>;
}
