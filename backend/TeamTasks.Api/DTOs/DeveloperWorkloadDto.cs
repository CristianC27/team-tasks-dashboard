namespace TeamTasks.Api.DTOs
{
    public class DeveloperWorkloadDto
    {
        public string DeveloperName { get; set; } = null!;
        public int OpenTasksCount { get; set; }
        public decimal AverageEstimatedComplexity { get; set; }
    }
}
