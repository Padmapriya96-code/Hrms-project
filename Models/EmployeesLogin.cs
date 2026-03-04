using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION.Models
{
    [Table("EmployeesLogin")]
    public class EmployeesLogin
    {


        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string EmployeeUserId { get; set; }

        [Required]
        [StringLength(25)]
        public string Password { get; set; }

        [StringLength(100)]
        public string? employeeFullName { get; set; }

        [StringLength(100)]
        public string? DBname { get; set; }



    }
}
