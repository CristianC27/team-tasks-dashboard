export interface Project {
  projectId: number;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string | null;
  status: string;
}
