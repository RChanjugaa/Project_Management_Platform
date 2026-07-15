"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { workspaceApi } from "@/services/workspace.service";
import type { AuthUser, RoleName } from "@/types/auth";
import type { Priority, Project, ProjectStatus, Task, TaskStatus } from "@/types/domain";

const projectStatuses: ProjectStatus[] = ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"];
const taskStatuses: TaskStatus[] = ["TO_DO", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"];
const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const emptyProject = { name: "", projectCode: "", description: "", status: "ACTIVE" as ProjectStatus, priority: "MEDIUM" as Priority, startDate: "", endDate: "" };
const emptyTask = { projectId: 0, assignedToId: null as number | null, title: "", description: "", status: "TO_DO" as TaskStatus, priority: "MEDIUM" as Priority, progress: 0, dueDate: "" };

export function ProjectsPage({ role }: { role: RoleName }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<AuthUser[]>([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [memberDraft, setMemberDraft] = useState<Record<number, number[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const canManage = role === "ADMIN" || role === "PROJECT_MANAGER";
  const tasksByProject = useMemo(() => {
    return tasks.reduce<Record<number, Task[]>>((grouped, task) => {
      grouped[task.projectId] = [...(grouped[task.projectId] ?? []), task];
      return grouped;
    }, {});
  }, [tasks]);

  const loadWorkspace = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const [projectResult, taskResult] = await Promise.all([workspaceApi.projects(), workspaceApi.tasks()]);
      setProjects(projectResult.projects);
      setTasks(taskResult.tasks);
      if (canManage) {
        const usersResult = await workspaceApi.assignableUsers();
        setAssignableUsers(usersResult.users);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load projects.");
    } finally {
      setIsLoading(false);
    }
  }, [canManage]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  async function runAction(action: () => Promise<unknown>, successMessage: string) {
    setError(null);
    setMessage(null);
    try {
      await action();
      setMessage(successMessage);
      await loadWorkspace();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed.");
    }
  }

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(() => workspaceApi.createProject(projectForm), "Project created.");
    setProjectForm(emptyProject);
  }

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(() => workspaceApi.createTask(taskForm), "Task created.");
    setTaskForm(emptyTask);
  }

  if (isLoading) return <LoadingSpinner label="Loading projects" />;

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error" message={error} /> : null}
      {message ? <Alert variant="success" message={message} /> : null}

      {canManage ? (
        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--text)]">Create Project</h2>
            <form onSubmit={createProject} className="mt-4 grid gap-4 md:grid-cols-2">
              <Input label="Name" value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} required />
              <Input label="Code" value={projectForm.projectCode} onChange={(event) => setProjectForm({ ...projectForm, projectCode: event.target.value })} required />
              <Select label="Status" value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value as ProjectStatus })}>{projectStatuses.map((item) => <option key={item}>{item}</option>)}</Select>
              <Select label="Priority" value={projectForm.priority} onChange={(event) => setProjectForm({ ...projectForm, priority: event.target.value as Priority })}>{priorities.map((item) => <option key={item}>{item}</option>)}</Select>
              <Input label="Start Date" type="date" value={projectForm.startDate} onChange={(event) => setProjectForm({ ...projectForm, startDate: event.target.value })} required />
              <Input label="End Date" type="date" value={projectForm.endDate} onChange={(event) => setProjectForm({ ...projectForm, endDate: event.target.value })} required />
              <div className="md:col-span-2"><Textarea label="Description" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} required /></div>
              <Button type="submit">Create Project</Button>
            </form>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[var(--text)]">Create Task</h2>
            <form onSubmit={createTask} className="mt-4 grid gap-4 md:grid-cols-2">
              <Select label="Project" value={taskForm.projectId} onChange={(event) => setTaskForm({ ...taskForm, projectId: Number(event.target.value), assignedToId: null })}>
                <option value={0}>Select project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </Select>
              <Select label="Assignee" value={taskForm.assignedToId ?? ""} onChange={(event) => setTaskForm({ ...taskForm, assignedToId: event.target.value ? Number(event.target.value) : null })}>
                <option value="">Unassigned</option>{projects.find((project) => project.id === taskForm.projectId)?.members.map((member) => <option key={member.userId} value={member.userId}>{member.user.name}</option>)}
              </Select>
              <Input label="Title" value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} required />
              <Input label="Due Date" type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} required />
              <Select label="Priority" value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value as Priority })}>{priorities.map((item) => <option key={item}>{item}</option>)}</Select>
              <Select label="Status" value={taskForm.status} onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value as TaskStatus })}>{taskStatuses.map((item) => <option key={item}>{item}</option>)}</Select>
              <div className="md:col-span-2"><Textarea label="Description" value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} required /></div>
              <Button type="submit">Create Task</Button>
            </form>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5">
        {projects.map((project) => {
          const selected = memberDraft[project.id] ?? project.members.map((member) => member.userId);
          const projectTasks = tasksByProject[project.id] ?? [];
          return (
            <article key={project.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text)]">{project.name}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{project.projectCode} · {project.status} · {project.priority}</p>
                  <p className="mt-3 max-w-3xl text-sm text-[var(--text)]">{project.description}</p>
                </div>
                {canManage ? <Button variant="secondary" onClick={() => void runAction(() => workspaceApi.deleteProject(project.id), "Project deleted.")}>Delete</Button> : null}
              </div>

              {canManage ? (
                <div className="mt-5 rounded-lg bg-[var(--surface-soft)] p-4">
                  <p className="text-sm font-semibold text-[var(--text)]">Members</p>
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    {assignableUsers.map((user) => (
                      <label key={user.id} className="flex items-center gap-2 text-sm text-[var(--text)]">
                        <input
                          type="checkbox"
                          checked={selected.includes(user.id)}
                          onChange={(event) => {
                            const next = event.target.checked ? [...selected, user.id] : selected.filter((id) => id !== user.id);
                            setMemberDraft({ ...memberDraft, [project.id]: next });
                          }}
                        />
                        {user.name}
                      </label>
                    ))}
                  </div>
                  <Button className="mt-3" variant="secondary" onClick={() => void runAction(() => workspaceApi.assignMembers(project.id, selected), "Members updated.")}>Save Members</Button>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[var(--muted)]">Members: {project.members.map((member) => member.user.name).join(", ") || "None"}</p>
              )}

              <div className="mt-5 grid gap-3">
                <h3 className="font-semibold text-[var(--text)]">Tasks</h3>
                {projectTasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--text)]">{task.title}</p>
                        <p className="text-sm text-[var(--muted)]">{task.status} · {task.priority} · assigned to {task.assignedTo?.name ?? "Unassigned"}</p>
                      </div>
                      <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-semibold text-[#2d3748]">{task.progress}%</span>
                    </div>
                    <p className="mt-3 text-sm text-[var(--text)]">{task.description}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_auto]">
                      <Select label="Status" value={task.status} onChange={(event) => void runAction(() => workspaceApi.updateTaskProgress(task.id, { status: event.target.value as TaskStatus, progress: task.progress }), "Task updated.")}>
                        {taskStatuses.map((item) => <option key={item}>{item}</option>)}
                      </Select>
                      <Input label="Progress" type="number" min={0} max={100} defaultValue={task.progress} onBlur={(event) => void runAction(() => workspaceApi.updateTaskProgress(task.id, { progress: Number(event.target.value), status: task.status }), "Progress updated.")} />
                      {canManage ? <Button className="self-end" variant="secondary" onClick={() => void runAction(() => workspaceApi.deleteTask(task.id), "Task deleted.")}>Delete</Button> : null}
                    </div>
                    <form className="mt-4 flex gap-2" onSubmit={(event) => {
                      event.preventDefault();
                      const content = commentDraft[task.id]?.trim();
                      if (content) void runAction(() => workspaceApi.addComment(task.id, content), "Comment added.");
                      setCommentDraft({ ...commentDraft, [task.id]: "" });
                    }}>
                      <Input label="Comment" value={commentDraft[task.id] ?? ""} onChange={(event) => setCommentDraft({ ...commentDraft, [task.id]: event.target.value })} />
                      <Button type="submit" className="self-end">Add</Button>
                    </form>
                  </div>
                ))}
                {projectTasks.length === 0 ? <p className="text-sm text-[var(--muted)]">No tasks in this project yet.</p> : null}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
