namespace TeamTasks.Api.DTOs
{
    public class DeveloperDelayRiskDto
    {
        public string DeveloperName { get; set; } = null!;
        public int OpenTasksCount { get; set; }
        public int AvgDelayDays { get; set; }
        public DateTime? NearestDueDate { get; set; }
        public DateTime? LatestDueDate { get; set; }
        public DateTime? PredictedCompletionDate { get; set; }
        public int HighRiskFlag { get; set; }
    }
}
