namespace HRMSAPPLICATION.DTO
{
    public class PaymDesignationDto
    {
       

        public int PnCompanyId { get; set; }

        public int PnBranchId { get; set; }

        public string VDesignationName { get; set; } = null!;

        public string? Authority { get; set; }

        public string? Status { get; set; }
    }
}
