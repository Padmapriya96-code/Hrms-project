using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION.Models
{
    [Table("UserAccounts")]
    public class UserAccounts
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [MaxLength(100)]
        public string? Username { get; set; }

        [MaxLength(100)]
        public string? Password { get; set; }
        [MaxLength(50)]
        public string? BranchUserId { get; set; }

        [MaxLength(50)]
        public string? BranchPassword { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [MaxLength(50)]
        public string? Status { get; set; } = "Active";
        [MaxLength(50)]
        public string? EmployeeUserId { get; set; }

        [MaxLength(100)]
        public string? EmployeePassword { get; set; }

        [MaxLength(100)]
        public string? EmployeeFullName { get; set; }
        [Required]
        [MaxLength(100)]
        public string DatabaseName { get; set; } 
    }
}
