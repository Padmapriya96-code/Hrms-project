namespace HRMSAPPLICATION.DTO
{
    public class PaymLeaveDto
    {
        public int PnCompanyId { get; set; }
        public int PnLeaveId { get; set; }
        public string VLeaveName { get; set; } = null!;
        public string? PnLeaveCode { get; set; }
        public int? PnCount { get; set; }
        public string? Status { get; set; }
        public int? PnBranchId { get; set; }
        //public string? AnnualLeave { get; set; }
        public int? MaxDays { get; set; }
        //public string? El { get; set; }
        public string? Type { get; set; }

    }
}
