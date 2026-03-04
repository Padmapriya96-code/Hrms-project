namespace HRMSAPPLICATION.DTO
{
    public class PaymDivisionCreateDto
    {
        public int PnCompanyId { get; set; }
        public int BranchId { get; set; }
        public string VDivisionName { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}
