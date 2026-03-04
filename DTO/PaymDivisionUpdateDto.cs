namespace HRMSAPPLICATION.DTO
{
    public class PaymDivisionUpdateDto
    {
        public int PnDivisionId { get; set; }
        public int BranchId { get; set; }
        public string VDivisionName { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}
