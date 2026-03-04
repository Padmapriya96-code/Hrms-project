namespace HRMSAPPLICATION.Models
{
    public class AssetAssignmentDto
    {
        public int PnCompanyId { get; set; }
        public int BranchId { get; set; }
        public int PnEmployeeId { get; set; }
        public string AssetName { get; set; } = null!;
        public string AssetSerialNumber { get; set; } = null!;

        // Make nullable or provide default empty string if optional
        public string? AssetType { get; set; } = null;
    }
}