namespace HRMSAPPLICATION.DTO
{
    public class GradeSlabDto
    {
        public int PnCompanyId { get; set; }
        public int PnBranchId { get; set; }
        public string SlabType { get; set; }
        public string GradeName { get; set; }
        public string LevelName { get; set; }

        // UI-Friendly Fields
        public decimal ExperienceFrom { get; set; }
        public decimal ExperienceTo { get; set; }
        public decimal CTC { get; set; }
        public string Division { get; set; }

    }
}
