using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRMSAPPLICATION.Models
{
    public class GradeSlabBranch
    {
        [Key]
        [Column("pn_GradeSlabID")]
        public int PnGradeSlabID { get; set; }
        public int PnCompanyId { get; set; }
        public int PnBranchId { get; set; }
        public string SlabType { get; set; }
        public string GradeName { get; set; }
        public string LevelName { get; set; }
        public decimal ExperienceFrom { get; set; }
        public decimal ExperienceTo { get; set; }
        public decimal CTC { get; set; }
        public string Valuetype { get; set; }

        // The "Bucket" Columns
        public decimal? Value1 { get; set; } // CTC
        public decimal? Value2 { get; set; } // Division
        public decimal? Value3 { get; set; }
        public decimal? Value4 { get; set; }
        public decimal? Value5 { get; set; }
        public decimal? Value6 { get; set; }
        public decimal? Value7 { get; set; }
        public decimal? Value8 { get; set; }
        public decimal? Value9 { get; set; }
        public decimal? Value10 { get; set; }

    }
}
