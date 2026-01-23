using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTasks.Api.Models
{
    [Table("developers")]
    public class Developer
    {
        [Key]
        [Column("developerid")]
        public int DeveloperId { get; set; }

        [Column("firstname")]
        public string FirstName { get; set; } = null!;

        [Column("lastname")]
        public string LastName { get; set; } = null!;

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("isactive")]
        public bool IsActive { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; }
    }
}
