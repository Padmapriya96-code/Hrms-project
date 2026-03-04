namespace HRMSAPPLICATION.DTO
{
    public class GradeSlabDivisionDto
    {
        public int PnCompanyId { get; set; }
        public int PnDivisionId { get; set; }
        public int PnBranchId { get; set; }
        public string GradeName { get; set; }
        public string LevelName { get; set; }
        public decimal ExperienceFrom { get; set; }
        public decimal ExperienceTo { get; set; }
        public decimal CTC { get; set; }
    }
}
