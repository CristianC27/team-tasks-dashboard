using System.ComponentModel.DataAnnotations;

namespace TeamTasks.Api.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        public int ProjectId { get; set; }
        [Required]
        public int AssigneeId { get; set; }
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public string Priority { get; set; }
        [Range(1, 5)]
        public int EstimatedComplexity { get; set; }

        [Required]
        public DateTime DueDate { get; set; }
    }
}
