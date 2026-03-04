namespace HRMSAPPLICATION.DTO
{
    public class PaymGradeDto
    {
        public int PnCompanyId { get; set; }
        public int BranchId { get; set; }
        public int PnGradeId { get; set; }
        public string VGradeName { get; set; } = null!;
        public string? Status { get; set; }
    }
}
