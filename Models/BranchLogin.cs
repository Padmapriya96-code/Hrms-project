using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION.Models
{

    [Table("Branchlogin")]
    public class Branchlogin
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string BranchUserId { get; set; }

        [Required]
        [StringLength(25)]
        public string Password { get; set; }

        [StringLength(100)]
        public string? DBname { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }
    }
}
