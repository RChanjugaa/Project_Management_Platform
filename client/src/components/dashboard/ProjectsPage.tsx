"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/contexts/AuthContext";
import { workspaceApi } from "@/services/workspace.service";
import type { AuthUser, SystemRole } from "@/types/auth";
import type { Priority, Project, ProjectStatus, Task, TaskStatus } from "@/types/domain";

const statuses: TaskStatus[] = ["TO_DO", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"];
const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const statusLabels: Record<TaskStatus, string> = { TO_DO: "To do", IN_PROGRESS: "In progress", UNDER_REVIEW: "Review", COMPLETED: "Completed" };
const emptyProject = { name: "", description: "", status: "ACTIVE" as ProjectStatus, priority: "MEDIUM" as Priority, startDate: "", endDate: "" };
const emptyTask = { projectId: 0, assignedToId: null as number | null, title: "", description: "", status: "TO_DO" as TaskStatus, priority: "MEDIUM" as Priority, progress: 0, dueDate: "" };

export function ProjectsPage({ role }: { role: SystemRole }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(0);
  const [composer, setComposer] = useState<"project" | "task" | null>(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [newMemberId, setNewMemberId] = useState(0);
  const [newMemberRole, setNewMemberRole] = useState<"PROJECT_LEADER" | "TEAM_MEMBER">("TEAM_MEMBER");
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [projectResult, taskResult] = await Promise.all([workspaceApi.projects(), workspaceApi.tasks()]);
      setProjects(projectResult.projects); setTasks(taskResult.tasks);
      setSelectedProjectId((current) => current || projectResult.projects[0]?.id || 0);
      const canLead = role === "ADMIN" || projectResult.projects.some((project) => project.members.some((member) => member.userId === user?.id && member.projectRole === "PROJECT_LEADER"));
      if (canLead) setUsers((await workspaceApi.assignableUsers()).users);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load workspace."); }
    finally { setLoading(false); }
  }, [role, user?.id]);

  useEffect(() => { void load(); }, [load]);

  const selected = projects.find((project) => project.id === selectedProjectId) ?? null;
  const projectTasks = useMemo(() => tasks.filter((task) => task.projectId === selectedProjectId), [tasks, selectedProjectId]);
  const canManage = role === "ADMIN" || Boolean(selected?.members.some((member) => member.userId === user?.id && member.projectRole === "PROJECT_LEADER"));
  const manageableProjects = role === "ADMIN" ? projects : projects.filter((project) => project.members.some((member) => member.userId === user?.id && member.projectRole === "PROJECT_LEADER"));

  async function action(work: () => Promise<unknown>, success: string) {
    setError(null); setMessage(null);
    try { await work(); setMessage(success); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Action failed."); }
  }

  async function createProject(event: FormEvent) {
    event.preventDefault();
    await action(() => workspaceApi.createProject(projectForm), "Project created with an automatic project code.");
    setProjectForm(emptyProject); setComposer(null);
  }

  async function createTask(event: FormEvent) {
    event.preventDefault();
    await action(() => workspaceApi.createTask(taskForm), "Task added to the board.");
    setTaskForm({ ...emptyTask, projectId: selectedProjectId }); setComposer(null);
  }

  function openTaskComposer() {
    setTaskForm({ ...emptyTask, projectId: selectedProjectId }); setComposer("task");
  }

  if (loading) return <LoadingSpinner label="Loading project workspace" />;

  return (
    <div className="space-y-5">
      {error ? <Alert variant="error" message={error} /> : null}
      {message ? <Alert variant="success" message={message} /> : null}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">Workspace</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Projects & tasks</h2></div>
          <div className="flex flex-wrap gap-2"><Button variant="secondary" className="rounded-xl" onClick={() => setComposer(composer === "project" ? null : "project")}>+ New project</Button>{manageableProjects.length ? <Button className="rounded-xl" onClick={openTaskComposer}>+ Add task</Button> : null}</div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {projects.map((project) => <button key={project.id} onClick={() => { setSelectedProjectId(project.id); setComposer(null); }} className={`shrink-0 rounded-xl border px-4 py-2.5 text-left transition ${project.id === selectedProjectId ? "border-[var(--primary)] bg-[var(--surface-soft)] shadow-sm" : "border-transparent hover:bg-[var(--surface-soft)]"}`}><span className="block text-sm font-semibold">{project.name}</span><span className="mt-0.5 block text-xs text-[var(--muted)]">{project.projectCode}</span></button>)}
          {!projects.length ? <p className="text-sm text-[var(--muted)]">No projects yet. Create your first project to become its Project Manager.</p> : null}
        </div>
      </section>

      {composer === "project" ? <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"><div className="mb-5"><h3 className="text-xl font-bold">Create project</h3><p className="mt-1 text-sm text-[var(--muted)]">Project ID and code are generated automatically. You become the Project Manager.</p></div><form onSubmit={createProject} className="grid gap-4 md:grid-cols-2"><Input label="Project name" placeholder="e.g. Website redesign" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} required/><Select label="Priority" value={projectForm.priority} onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value as Priority })}>{priorities.map((item) => <option key={item} value={item}>{item[0] + item.slice(1).toLowerCase()}</option>)}</Select><Input label="Start date" type="date" value={projectForm.startDate} onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })} required/><Input label="Target end date" type="date" min={projectForm.startDate} value={projectForm.endDate} onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })} required/><div className="md:col-span-2"><Textarea label="Project description" placeholder="What outcome should this project deliver?" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required/></div><div className="flex justify-end gap-2 md:col-span-2"><Button variant="secondary" onClick={() => setComposer(null)}>Cancel</Button><Button type="submit">Create project</Button></div></form></section> : null}

      {composer === "task" ? <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"><div className="mb-5"><h3 className="text-xl font-bold">Add task</h3><p className="mt-1 text-sm text-[var(--muted)]">Create a focused work item for the selected project.</p></div><form onSubmit={createTask} className="grid gap-4 md:grid-cols-2"><Select label="Project" value={taskForm.projectId} onChange={(e) => setTaskForm({ ...taskForm, projectId: Number(e.target.value), assignedToId: null })}>{manageableProjects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</Select><Select label="Assignee" value={taskForm.assignedToId ?? ""} onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value ? Number(e.target.value) : null })}><option value="">Unassigned</option>{projects.find((project) => project.id === taskForm.projectId)?.members.map((member) => <option key={member.userId} value={member.userId}>{member.user.name}</option>)}</Select><Input label="Task title" placeholder="e.g. Review dashboard wireframes" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required/><Input label="Due date" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} required/><Select label="Priority" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}>{priorities.map((item) => <option key={item}>{item}</option>)}</Select><div className="md:col-span-2"><Textarea label="Task description" placeholder="Add acceptance details or useful context..." value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} required/></div><div className="flex justify-end gap-2 md:col-span-2"><Button variant="secondary" onClick={() => setComposer(null)}>Cancel</Button><Button type="submit">Add to board</Button></div></form></section> : null}

      {selected ? <>
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-4"><div><div className="flex items-center gap-2"><h2 className="text-2xl font-bold">{selected.name}</h2><span className="rounded-full bg-[var(--primary)]/25 px-2.5 py-1 text-xs font-semibold">{selected.status.replace("_", " ")}</span></div><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{selected.description}</p></div><div className="text-right text-sm"><p className="font-semibold">{selected.projectCode}</p><p className="text-[var(--muted)]">{projectTasks.length} tasks · {selected.members.length} members</p></div></div></section>

        <section className="overflow-x-auto pb-3"><div className="grid min-w-[1050px] grid-cols-4 gap-4">{statuses.map((status) => { const column = projectTasks.filter((task) => task.status === status); return <div key={status} className="rounded-2xl bg-[var(--surface-soft)] p-3"><div className="mb-3 flex items-center justify-between px-1"><h3 className="text-sm font-bold">{statusLabels[status]}</h3><span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-semibold">{column.length}</span></div><div className="space-y-3">{column.map((task) => <article key={task.id} className="rounded-xl border border-[var(--border)]/70 bg-[var(--surface)] p-4 shadow-sm"><div className="flex items-start justify-between gap-2"><h4 className="font-semibold leading-5">{task.title}</h4><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${task.priority === "URGENT" ? "bg-red-500" : task.priority === "HIGH" ? "bg-[var(--accent)]" : "bg-[var(--primary)]"}`}/>{canManage ? <button aria-label={`Delete ${task.title}`} className="text-xs text-[var(--muted)] hover:text-red-600" onClick={() => void action(() => workspaceApi.deleteTask(task.id), "Task deleted.")}>×</button> : null}</div></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{task.description}</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]"><div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${task.progress}%` }}/></div><div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]"><span>{task.assignedTo?.name ?? "Unassigned"}</span><span>{task.progress}%</span></div>{canManage || task.assignedToId === user?.id ? <Select label="Move to" className="mt-1 h-10 text-sm" value={task.status} onChange={(e) => void action(() => workspaceApi.updateTaskProgress(task.id, { status: e.target.value as TaskStatus, progress: e.target.value === "COMPLETED" ? 100 : task.progress }), "Task moved.")}>{statuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</Select> : null}<form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); const content = commentDraft[task.id]?.trim(); if (content) void action(() => workspaceApi.addComment(task.id, content), "Comment added."); setCommentDraft({ ...commentDraft, [task.id]: "" }); }}><input aria-label={`Comment on ${task.title}`} placeholder="Add comment..." className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-xs" value={commentDraft[task.id] ?? ""} onChange={(e) => setCommentDraft({ ...commentDraft, [task.id]: e.target.value })}/><Button type="submit" variant="secondary" className="min-h-9 px-3">Send</Button></form>{task.comments?.length ? <p className="mt-2 text-xs text-[var(--muted)]">{task.comments.length} comment{task.comments.length === 1 ? "" : "s"}</p> : null}</article>)}{!column.length ? <div className="rounded-xl border border-dashed border-[var(--border)] p-5 text-center text-xs text-[var(--muted)]">No tasks here</div> : null}</div></div>; })}</div></section>

        {canManage ? <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-bold">Project team</h3><p className="text-sm text-[var(--muted)]">Roles apply only to this project.</p></div><div className="flex flex-wrap items-end gap-2"><Select label="User" value={newMemberId} onChange={(e) => setNewMemberId(Number(e.target.value))}><option value={0}>Select user</option>{users.filter((item) => !selected.members.some((member) => member.userId === item.id)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select><Select label="Project role" value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value as "PROJECT_LEADER" | "TEAM_MEMBER")}><option value="TEAM_MEMBER">Team Member</option><option value="PROJECT_LEADER">Project Manager</option></Select><Button disabled={!newMemberId} onClick={() => void action(() => workspaceApi.addMember(selected.id, newMemberId, newMemberRole), "Member added.")}>Add member</Button></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{selected.members.map((member) => <div key={member.userId} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-soft)] p-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] font-bold">{member.user.name.slice(0, 1).toUpperCase()}</span><div><p className="text-sm font-semibold">{member.user.name}</p><p className="text-xs text-[var(--muted)]">{member.projectRole === "PROJECT_LEADER" ? "Project Manager" : "Team Member"}</p></div></div><button className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]" onClick={() => void action(() => workspaceApi.removeMember(selected.id, member.userId), "Member removed.")}>Remove</button></div>)}</div></section> : null}
      </> : null}
    </div>
  );
}
