using Humanizer;
using System.ComponentModel.DataAnnotations;

namespace HRMSAPPLICATION.DTO
{
    public class BranchDTO
    {



        [Required]
        [StringLength(50)]
        public string username { get; set; }

        [Required]
        [StringLength(25)]
        public string Password { get; set; }


    }
}
