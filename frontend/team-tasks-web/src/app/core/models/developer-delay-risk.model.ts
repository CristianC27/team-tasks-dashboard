export interface DeveloperDelayRisk {
  developerName: string;
  openTasksCount: number;
  avgDelayDays: number;
  nearestDueDate: string | null;
  latestDueDate: string | null;
  predictedCompletionDate: string | null;
  highRiskFlag: number;
}
