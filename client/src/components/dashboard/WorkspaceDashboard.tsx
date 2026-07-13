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
import type { Priority, Project, ProjectStatus, Role, Task, TaskStatus } from "@/types/domain";

const projectStatuses: ProjectStatus[] = ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"];
const taskStatuses: TaskStatus[] = ["TO_DO", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"];
const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const emptyProject = { name: "", projectCode: "", description: "", status: "PLANNING" as ProjectStatus, priority: "MEDIUM" as Priority, startDate: "", endDate: "" };
const emptyTask = { projectId: 0, assignedToId: null as number | null, title: "", description: "", status: "TO_DO" as TaskStatus, priority: "MEDIUM" as Priority, progress: 0, dueDate: "" };

export function WorkspaceDashboard({ role }: { role: RoleName }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<AuthUser[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", roleId: 0, status: "ACTIVE" as "ACTIVE" | "INACTIVE" });
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [memberDraft, setMemberDraft] = useState<Record<number, number[]>>({});
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});

  const canManageUsers = role === "ADMIN";
  const canManageWork = role === "ADMIN" || role === "PROJECT_MANAGER";
  const stats = useMemo(() => [
    { label: "Users", value: users.length || assignableUsers.length },
    { label: "Projects", value: projects.length },
    { label: "Tasks", value: tasks.length },
    { label: "Completed", value: tasks.filter((task) => task.status === "COMPLETED").length }
  ], [assignableUsers.length, projects.length, tasks, users.length]);

  const loadWorkspace = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const [projectResult, taskResult] = await Promise.all([workspaceApi.projects(), workspaceApi.tasks()]);
      setProjects(projectResult.projects);
      setTasks(taskResult.tasks);
      if (canManageUsers) {
        const [roleResult, userResult, assignableResult] = await Promise.all([workspaceApi.roles(), workspaceApi.users(), workspaceApi.assignableUsers()]);
        setRoles(roleResult.roles);
        setUsers(userResult.users);
        setAssignableUsers(assignableResult.users);
        setUserForm((current) => ({ ...current, roleId: current.roleId || roleResult.roles[0]?.id || 0 }));
      } else if (canManageWork) {
        const assignableResult = await workspaceApi.assignableUsers();
        setAssignableUsers(assignableResult.users);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load workspace.");
    } finally {
      setIsLoading(false);
    }
  }, [canManageUsers, canManageWork]);

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

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(() => workspaceApi.createUser(userForm), "User saved.");
    setUserForm({ name: "", email: "", password: "", roleId: roles[0]?.id ?? 0, status: "ACTIVE" });
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(() => workspaceApi.createProject(projectForm), "Project saved.");
    setProjectForm(emptyProject);
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(() => workspaceApi.createTask(taskForm), "Task saved.");
    setTaskForm(emptyTask);
  }

  if (isLoading) return <LoadingSpinner label="Loading workspace" />;

  return (
    <div className="space-y-6">
      {error ? <Alert variant="error" message={error} /> : null}
      {message ? <Alert variant="success" message={message} /> : null}

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-lg border border-[#a7d8de] bg-[#b8e0d2]/55 p-5">
            <p className="text-sm text-[#2d3748]/70">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#2d3748]">{item.value}</p>
          </div>
        ))}
      </section>

      {canManageUsers ? (
        <section className="rounded-lg border border-[#a7d8de] bg-white p-5">
          <h2 className="text-xl font-semibold text-[#2d3748]">User Management</h2>
          <form onSubmit={handleCreateUser} className="mt-4 grid gap-4 md:grid-cols-5">
            <Input label="Name" value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} required />
            <Input label="Email" type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} required />
            <Input label="Password" type="password" value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} required />
            <Select label="Role" value={userForm.roleId} onChange={(event) => setUserForm({ ...userForm, roleId: Number(event.target.value) })}>
              {roles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Select>
            <Button type="submit" className="self-end">Add User</Button>
          </form>
          <DataTable headers={["Name", "Email", "Role", "Status", "Action"]}>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#a7d8de]/40">
                <td className="p-3 font-medium">{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.status}</td>
                <td><Button variant="secondary" onClick={() => void runAction(() => workspaceApi.deactivateUser(user.id), "User deactivated.")}>Deactivate</Button></td>
              </tr>
            ))}
          </DataTable>
        </section>
      ) : null}

      {canManageWork ? (
        <section className="rounded-lg border border-[#a7d8de] bg-white p-5">
          <h2 className="text-xl font-semibold text-[#2d3748]">Project Management</h2>
          <form onSubmit={handleCreateProject} className="mt-4 grid gap-4 md:grid-cols-3">
            <Input label="Project Name" value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} required />
            <Input label="Project Code" value={projectForm.projectCode} onChange={(event) => setProjectForm({ ...projectForm, projectCode: event.target.value })} required />
            <Select label="Priority" value={projectForm.priority} onChange={(event) => setProjectForm({ ...projectForm, priority: event.target.value as Priority })}>{priorities.map((item) => <option key={item}>{item}</option>)}</Select>
            <Select label="Status" value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value as ProjectStatus })}>{projectStatuses.map((item) => <option key={item}>{item}</option>)}</Select>
            <Input label="Start Date" type="date" value={projectForm.startDate} onChange={(event) => setProjectForm({ ...projectForm, startDate: event.target.value })} required />
            <Input label="End Date" type="date" value={projectForm.endDate} onChange={(event) => setProjectForm({ ...projectForm, endDate: event.target.value })} required />
            <div className="md:col-span-3"><Textarea label="Description" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} required /></div>
            <Button type="submit">Create Project</Button>
          </form>
        </section>
      ) : null}

      <section className="rounded-lg border border-[#a7d8de] bg-white p-5">
        <h2 className="text-xl font-semibold text-[#2d3748]">Projects</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {projects.map((project) => {
            const selected = memberDraft[project.id] ?? project.members.map((member) => member.userId);
            return (
              <article key={project.id} className="rounded-lg border border-[#b8e0d2] bg-[#f7fafc] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-semibold text-[#2d3748]">{project.name}</h3><p className="text-sm text-[#2d3748]/70">{project.projectCode} · {project.status} · {project.priority}</p></div>
                  {canManageWork ? <Button variant="danger" onClick={() => void runAction(() => workspaceApi.deleteProject(project.id), "Project deleted.")}>Delete</Button> : null}
                </div>
                <p className="mt-3 text-sm text-[#2d3748]">{project.description}</p>
                <p className="mt-3 text-sm text-[#2d3748]/70">Members: {project.members.map((member) => member.user.name).join(", ") || "None"}</p>
                {canManageWork ? (
                  <div className="mt-4 rounded-md bg-white p-3">
                    <p className="text-sm font-medium text-[#2d3748]">Assign Members</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {assignableUsers.map((user) => (
                        <label key={user.id} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={selected.includes(user.id)} onChange={(event) => {
                            const next = event.target.checked ? [...selected, user.id] : selected.filter((id) => id !== user.id);
                            setMemberDraft({ ...memberDraft, [project.id]: next });
                          }} />
                          {user.name} ({user.role})
                        </label>
                      ))}
                    </div>
                    <Button className="mt-3" variant="secondary" onClick={() => void runAction(() => workspaceApi.assignMembers(project.id, selected), "Members assigned.")}>Save Members</Button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      {canManageWork ? (
        <section className="rounded-lg border border-[#a7d8de] bg-white p-5">
          <h2 className="text-xl font-semibold text-[#2d3748]">Task Management</h2>
          <form onSubmit={handleCreateTask} className="mt-4 grid gap-4 md:grid-cols-3">
            <Select label="Project" value={taskForm.projectId} onChange={(event) => setTaskForm({ ...taskForm, projectId: Number(event.target.value), assignedToId: null })}>
              <option value={0}>Select project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </Select>
            <Select label="Assignee" value={taskForm.assignedToId ?? ""} onChange={(event) => setTaskForm({ ...taskForm, assignedToId: event.target.value ? Number(event.target.value) : null })}>
              <option value="">Unassigned</option>{projects.find((project) => project.id === taskForm.projectId)?.members.map((member) => <option key={member.userId} value={member.userId}>{member.user.name}</option>)}
            </Select>
            <Input label="Due Date" type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} required />
            <Input label="Title" value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} required />
            <Select label="Priority" value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value as Priority })}>{priorities.map((item) => <option key={item}>{item}</option>)}</Select>
            <Select label="Status" value={taskForm.status} onChange={(event) => setTaskForm({ ...taskForm, status: event.target.value as TaskStatus })}>{taskStatuses.map((item) => <option key={item}>{item}</option>)}</Select>
            <div className="md:col-span-3"><Textarea label="Description" value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} required /></div>
            <Button type="submit">Create Task</Button>
          </form>
        </section>
      ) : null}

      <section className="rounded-lg border border-[#a7d8de] bg-white p-5">
        <h2 className="text-xl font-semibold text-[#2d3748]">Tasks</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-lg border border-[#b8e0d2] bg-[#f7fafc] p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div><h3 className="font-semibold text-[#2d3748]">{task.title}</h3><p className="text-sm text-[#2d3748]/70">{task.project?.name ?? "Project"} · {task.status} · {task.priority}</p></div>
                <span className="rounded-full bg-[#ffb4a2] px-3 py-1 text-sm font-semibold text-[#2d3748]">{task.progress}%</span>
              </div>
              <p className="mt-3 text-sm text-[#2d3748]">{task.description}</p>
              <p className="mt-2 text-sm text-[#2d3748]/70">Assigned to: {task.assignedTo?.name ?? "Unassigned"}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_auto]">
                <Select label="Status" value={task.status} onChange={(event) => void runAction(() => workspaceApi.updateTaskProgress(task.id, { status: event.target.value as TaskStatus, progress: task.progress }), "Task updated.")}>
                  {taskStatuses.map((item) => <option key={item}>{item}</option>)}
                </Select>
                <Input label="Progress" type="number" min={0} max={100} defaultValue={task.progress} onBlur={(event) => void runAction(() => workspaceApi.updateTaskProgress(task.id, { progress: Number(event.target.value), status: task.status }), "Progress updated.")} />
                {canManageWork ? <Button className="self-end" variant="danger" onClick={() => void runAction(() => workspaceApi.deleteTask(task.id), "Task deleted.")}>Delete</Button> : null}
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
              <div className="mt-3 space-y-2">
                {task.comments?.slice(0, 3).map((comment) => <p key={comment.id} className="rounded-md bg-white p-2 text-sm text-[#2d3748]"><span className="font-semibold">{comment.user.name}:</span> {comment.content}</p>)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#a7d8de]/35 text-[#2d3748]">
          <tr>{headers.map((header) => <th key={header} className="p-3">{header}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
