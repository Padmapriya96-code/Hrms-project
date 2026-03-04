namespace HRMSAPPLICATION.DTO
{
    public class PaymDepartmentDto
    {
        public int PnDepartmentId { get; set; }   // for PUT
        public int PnCompanyId { get; set; }
        public int PnBranchId { get; set; }
        public string VDepartmentName { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}
