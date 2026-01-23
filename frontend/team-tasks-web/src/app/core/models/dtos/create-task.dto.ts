export interface CreateTaskDto {
  projectId: number;
  assigneeId: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  estimatedComplexity: number;
  dueDate: string;
}
