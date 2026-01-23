namespace TeamTasks.Api.DTOs
{
    public class ProjectSummaryDto
    {
        public string ProjectName { get; set; } = null!;
        public string ClientName { get; set; } = null!;
        public int TotalTasks { get; set; }
        public int OpenTasks { get; set; }
        public int CompletedTasks { get; set; }
    }
}
