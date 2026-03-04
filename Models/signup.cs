using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION.Models
{
    [Table("signup")]   // Correct casing
    public class signup
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string DatabaseName { get; set; } = string.Empty;
    }
}
