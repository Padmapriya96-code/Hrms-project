namespace HRMSAPPLICATION.DTO
{
    public class PaymLevelDto
    {
        public int PnCompanyId { get; set; }
        public int BranchId { get; set; }
        public int PnLevelId { get; set; }
        public string VLevelName { get; set; } = null!;
        public string? Status { get; set; }
    }
}
