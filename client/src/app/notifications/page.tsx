"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { workspaceApi } from "@/services/workspace.service";
export default function NotificationsPage() {
  const [items, setItems] = useState<Array<{ id: number; title: string; message: string; isRead: boolean; createdAt: string }>>([]);
  const load = () => workspaceApi.notifications().then((result) => setItems(result.notifications));
  useEffect(() => { void load(); }, []);
  return <DashboardLayout title="Notifications"><div className="grid gap-3">{items.map((item) => <article key={item.id} className={`rounded-lg border border-[var(--border)] p-4 ${item.isRead ? "bg-[var(--surface)]" : "bg-[var(--surface-soft)]"}`}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm">{item.message}</p><p className="mt-2 text-xs text-[var(--muted)]">{new Date(item.createdAt).toLocaleString()}</p></div>{!item.isRead ? <Button variant="secondary" onClick={() => void workspaceApi.readNotification(item.id).then(load)}>Mark read</Button> : null}</div></article>)}{items.length === 0 ? <p>No notifications yet.</p> : null}</div></DashboardLayout>;
}
