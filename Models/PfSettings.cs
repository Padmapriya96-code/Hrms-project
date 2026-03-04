using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace HRMSAPPLICATION.Models
{
    [Table("PF_Settings")]
    public class PfSettings
    {
        [Key]
        
        [Column("pn_CompanyID")]
        public int PnCompanyId { get; set; }

        [Required]
        [StringLength(20)]
        [Column("Effective_Month_From")]
        public string EffectiveMonthFrom { get; set; }

        [Column("Effective_From_Year")]
        public int? EffectiveFromYear { get; set; }

        // Use double if the DB is 'float'. Use decimal if DB is 'decimal'
        [Column("PF_Contribution(%)")]
        public double? PfContributionPercentage { get; set; }

        [Column("Max_Ceiling")]
        public string MaxCeiling { get; set; }

        [Column("PF_below_ceiling")]
        public string PfBelowCeiling { get; set; }

        [Column("EPF_Contribution(%)")]
        public double? EpfContributionPercentage { get; set; }

        [Column("Upper_Limit")]
        public decimal? UpperLimit { get; set; }

        [Column("EPS_Contribution(%)")]
        public double? EpsContributionPercentage { get; set; }

        [Column("Eligibility_Amount")]
        public decimal? EligibilityAmount { get; set; }

        [Column("Admin_Charges(%)")]
        public double? AdminChargesPercentage { get; set; }

        [Column("Rounding_Options")]
        public string RoundingOptions { get; set; }
    }
}

