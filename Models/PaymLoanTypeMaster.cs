using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace HRMSAPPLICATION.Models
{
    [Table("Paym_LoanTypeMaster")]
    public class PaymLoanTypeMaster
    {
        [Key]
        [Column("v_LoanTypeName")]
        public int PnLoanTypeId { get; set; }
        [Required] // Assuming this is mandatory based on your 'Allow Nulls' unchecked status
        [Column("v_LoanTypeName")]
        public string VLoanTypeName { get; set; }

        [Column("status")]
        public string Status { get; set; }

        [Column("CreatedDate")]
        public DateTime? CreatedDate { get; set; }

        [Column("ModifiedDate")]
        public DateTime? ModifiedDate { get; set; }

        [Column("pn_CompanyID")]
        public int PnCompanyID { get; set; }

    }
}
