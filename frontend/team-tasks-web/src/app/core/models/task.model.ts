export interface Task {
  taskId: number;
  projectId: number;
  assigneeId: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  estimatedComplexity: number;
  dueDate: string;
  completionDate: string | null;
  createdAt: string;
  developerFullName: string;
}
