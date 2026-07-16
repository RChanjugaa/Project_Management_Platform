"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { workspaceApi } from "@/services/workspace.service";
import type { SystemRole } from "@/types/auth";
import type { Project, Task } from "@/types/domain";

export function OverviewDashboard({ role }: { role: SystemRole }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [projectResult, taskResult] = await Promise.all([workspaceApi.projects(), workspaceApi.tasks()]);
        setProjects(projectResult.projects);
        setTasks(taskResult.tasks);
        if (role === "ADMIN") {
          const userResult = await workspaceApi.users();
          setUserCount(userResult.users.length);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load dashboard.");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [role]);

  const stats = useMemo(
    () => [
      ...(role === "ADMIN" ? [{ label: "Users", value: userCount }] : []),
      { label: "Projects", value: projects.length },
      { label: "Tasks", value: tasks.length },
      { label: "Completed", value: tasks.filter((task) => task.status === "COMPLETED").length }
    ],
    [projects.length, role, tasks, userCount]
  );

  if (isLoading) return <LoadingSpinner label="Loading dashboard" />;

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error" message={error} /> : null}
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--text)]">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--text)]">Today&apos;s Focus</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {tasks.slice(0, 3).map((task) => (
            <article key={task.id} className="rounded-lg bg-[var(--surface-soft)] p-4">
              <p className="font-semibold text-[var(--text)]">{task.title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{task.status} · {task.progress}%</p>
            </article>
          ))}
          {tasks.length === 0 ? <p className="text-sm text-[var(--muted)]">No tasks yet. Create projects and tasks from the Projects page.</p> : null}
        </div>
      </section>
    </div>
  );
}
