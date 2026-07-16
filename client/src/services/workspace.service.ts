import { apiRequest } from "@/services/api";
import type { AuthUser } from "@/types/auth";
import type { Priority, Project, ProjectStatus, Task, TaskStatus } from "@/types/domain";

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  systemRole: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
}

export interface ProjectPayload {
  name: string;
  projectCode?: string;
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
  users: () => apiRequest<{ users: AuthUser[] }>("/users"),
  assignableUsers: () => apiRequest<{ users: AuthUser[] }>("/users/assignable"),
  createUser: (payload: UserPayload) => apiRequest<{ user: AuthUser }>("/users", { method: "POST", body: JSON.stringify(payload) }),
  updateUser: (id: number, payload: Partial<UserPayload>) => apiRequest<{ user: AuthUser }>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deactivateUser: (id: number) => apiRequest<{ user: AuthUser }>(`/users/${id}`, { method: "DELETE" }),
  projects: () => apiRequest<{ projects: Project[] }>("/projects"),
  createProject: (payload: ProjectPayload) => apiRequest<{ project: Project }>("/projects", { method: "POST", body: JSON.stringify(payload) }),
  deleteProject: (id: number) => apiRequest<null>(`/projects/${id}`, { method: "DELETE" }),
  addMember: (id: number, userId: number, projectRole: "PROJECT_LEADER" | "TEAM_MEMBER") => apiRequest<{ project: Project }>(`/projects/${id}/members`, { method: "POST", body: JSON.stringify({ userId, projectRole }) }),
  updateMemberRole: (id: number, userId: number, projectRole: "PROJECT_LEADER" | "TEAM_MEMBER") => apiRequest<{ project: Project }>(`/projects/${id}/members/${userId}`, { method: "PATCH", body: JSON.stringify({ projectRole }) }),
  removeMember: (id: number, userId: number) => apiRequest<null>(`/projects/${id}/members/${userId}`, { method: "DELETE" }),
  tasks: () => apiRequest<{ tasks: Task[] }>("/tasks"),
  createTask: (payload: TaskPayload) => apiRequest<{ task: Task }>("/tasks", { method: "POST", body: JSON.stringify(payload) }),
  deleteTask: (id: number) => apiRequest<null>(`/tasks/${id}`, { method: "DELETE" }),
  updateTaskProgress: (id: number, payload: { status?: TaskStatus; progress: number }) =>
    apiRequest<{ task: Task }>(`/tasks/${id}/progress`, { method: "PATCH", body: JSON.stringify(payload) }),
  addComment: (id: number, content: string) => apiRequest(`/tasks/${id}/comments`, { method: "POST", body: JSON.stringify({ content }) })
  ,notifications: () => apiRequest<{ notifications: Array<{ id: number; title: string; message: string; isRead: boolean; createdAt: string }> }>("/notifications"),
  readNotification: (id: number) => apiRequest(`/notifications/${id}/read`, { method: "PATCH" }),
  activityLogs: () => apiRequest<{ items: Array<{ id: number; action: string; entityType: string; createdAt: string; user?: { name: string } | null }> }>("/activity-logs"),
  updateProfile: (payload: { name?: string; avatarUrl?: string | null }) => apiRequest<{ user: AuthUser }>("/users/me/profile", { method: "PATCH", body: JSON.stringify(payload) }),
  changePassword: (payload: { currentPassword: string; newPassword: string }) => apiRequest("/users/me/password", { method: "PATCH", body: JSON.stringify(payload) })
};
