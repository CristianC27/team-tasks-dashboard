using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTasks.Api.Models
{
    [Table("projects")]
    public class Project
    {
        [Key]
        [Column("projectid")]
        public int ProjectId { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("clientname")]
        public string ClientName { get; set; } = null!;

        [Column("startdate")]
        public DateTime StartDate { get; set; }

        [Column("enddate")]
        public DateTime? EndDate { get; set; }

        [Column("status")]
        public string Status { get; set; } = null!;
    }
}
