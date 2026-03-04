using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace HRMSAPPLICATION.Models
{
    [Table("GradeSlab_Division")]
    public class GradeSlabDivision
    {
        
        [Column("GradeSlabID")]
        [Key]
        public int GradeSlabID { get; set; }
        [Column("pn_CompanyID")]
        public int PnCompanyId { get; set; }

        [Column("pn_DivisionID")]
        public int PnDivisionId { get; set; }

        [Column("pn_branchid")]
        public int PnBranchId { get; set; }

        public string SlabType { get; set; }
        public string GradeName { get; set; }
        public string LevelName { get; set; }
        public decimal ExperienceFrom { get; set; }
        public decimal ExperienceTo { get; set; }
        public decimal CTC { get; set; }
        public string Valuetype { get; set; }

        // Bucket values
        public decimal? Value1 { get; set; }
        public decimal? Value2 { get; set; }
        public decimal? Value3 { get; set; }
        public decimal? Value4 { get; set; }

    }
}
