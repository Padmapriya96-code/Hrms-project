using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION
{
    [Table("ProRataBasisMasters")]
    public class ProRataBasis
    {
        [Key] // Assuming unique ID, or see ModelBuilder below for composite keys
        public int PnCompanyId { get; set; }
        public int PnBranchId { get; set; }

        public string Allowance1PRB { get; set; }
        public string Allowance2PRB{ get; set; }
        public string Allowance3PRB { get; set; }
        public string Allowance4PRB { get; set; }
        public string Allowance5PRB { get; set; }
        public string Allowance6PRB { get; set; }
        public string Allowance7PRB { get; set; }
        public string Allowance8PRB { get; set; }
        public string Allowance9PRB { get; set; }
        public string Allowance10PRB { get; set; }

        public string Deduction1PRB { get; set; }
        public string Deduction2PRB { get; set; }
        public string Deduction3PRB { get; set; }
        public string Deduction4PRB { get; set; }
        public string Deduction5PRB { get; set; }
        public string Deduction6PRB { get; set; }
        public string Deduction7PRB { get; set; }
        public string Deduction8PRB { get; set; }
        public string Deduction9PRB { get; set; }
        public string Deduction10PRB { get; set; }


    }
}
