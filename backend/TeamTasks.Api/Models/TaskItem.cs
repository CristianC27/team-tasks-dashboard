using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTasks.Api.Models
{
    [Table("tasks")]
    public class TaskItem
    {
        [Key]
        [Column("taskid")]
        public int TaskId { get; set; }

        [Column("projectid")]
        public int ProjectId { get; set; }
        [Column("assigneeid")]
        public int AssigneeId { get; set; }

        [Column("title")]
        public string Title { get; set; } = null!;

        [Column("description")]
        public string? Description { get; set; }

        [Column("status")]
        public string Status { get; set; } = null!;

        [Column("priority")]
        public string Priority { get; set; } = null!;

        [Column("estimatedcomplexity")]
        public int EstimatedComplexity { get; set; }

        [Column("duedate")]
        public DateTime DueDate { get; set; }

        [Column("completiondate")]
        public DateTime? CompletionDate { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; }
    }
}
