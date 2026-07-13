import { apiRequest } from "@/services/api";
import type { AuthUser } from "@/types/auth";
import type { Priority, Project, ProjectStatus, Role, Task, TaskStatus } from "@/types/domain";

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  roleId: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface ProjectPayload {
  name: string;
  projectCode: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  endDate: string;
}

export interface TaskPayload {
  projectId: number;
  assignedToId?: number | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  progress: number;
  dueDate: string;
}

export const workspaceApi = {
  roles: () => apiRequest<{ roles: Role[] }>("/users/roles"),
  users: () => apiRequest<{ users: AuthUser[] }>("/users"),
  assignableUsers: () => apiRequest<{ users: AuthUser[] }>("/users/assignable"),
  createUser: (payload: UserPayload) => apiRequest<{ user: AuthUser }>("/users", { method: "POST", body: JSON.stringify(payload) }),
  deactivateUser: (id: number) => apiRequest<{ user: AuthUser }>(`/users/${id}`, { method: "DELETE" }),
  projects: () => apiRequest<{ projects: Project[] }>("/projects"),
  createProject: (payload: ProjectPayload) => apiRequest<{ project: Project }>("/projects", { method: "POST", body: JSON.stringify(payload) }),
  deleteProject: (id: number) => apiRequest<null>(`/projects/${id}`, { method: "DELETE" }),
  assignMembers: (id: number, userIds: number[]) => apiRequest<{ project: Project }>(`/projects/${id}/members`, { method: "POST", body: JSON.stringify({ userIds }) }),
  tasks: () => apiRequest<{ tasks: Task[] }>("/tasks"),
  createTask: (payload: TaskPayload) => apiRequest<{ task: Task }>("/tasks", { method: "POST", body: JSON.stringify(payload) }),
  deleteTask: (id: number) => apiRequest<null>(`/tasks/${id}`, { method: "DELETE" }),
  updateTaskProgress: (id: number, payload: { status?: TaskStatus; progress: number }) =>
    apiRequest<{ task: Task }>(`/tasks/${id}/progress`, { method: "PATCH", body: JSON.stringify(payload) }),
  addComment: (id: number, content: string) => apiRequest(`/tasks/${id}/comments`, { method: "POST", body: JSON.stringify({ content }) })
};
