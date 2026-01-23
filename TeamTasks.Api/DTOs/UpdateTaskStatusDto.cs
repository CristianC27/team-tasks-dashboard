using System.ComponentModel.DataAnnotations;

namespace TeamTasks.Api.DTOs
{
    public class UpdateTaskStatusDto
    {
        public string Status { get; set; } = null!;
        public string? Priority { get; set; }
        [Range(1, 5)]
        public int? EstimatedComplexity { get; set; }
    }
}
