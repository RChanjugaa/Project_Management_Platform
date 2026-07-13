import type { AuthUser } from "@/types/auth";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";
export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface ProjectMember {
  id: number;
  userId: number;
  user: AuthUser;
}

export interface Project {
  id: number;
  createdById: number;
  name: string;
  projectCode: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  endDate: string;
  members: ProjectMember[];
  tasks: Task[];
}

export interface TaskComment {
  id: number;
  content: string;
  createdAt: string;
  user: AuthUser;
}

export interface Task {
  id: number;
  projectId: number;
  assignedToId: number | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  progress: number;
  dueDate: string;
  project?: Project;
  assignedTo?: AuthUser | null;
  comments?: TaskComment[];
}
