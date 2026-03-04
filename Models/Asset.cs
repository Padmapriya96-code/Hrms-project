using System.ComponentModel.DataAnnotations;

namespace HRMSAPPLICATION.Models
{
    public partial class Asset
    {
        public int PnCompanyId { get; set; }
        public int BranchId { get; set; }
        [Key]
        public int PnAssetid { get; set; }
        public string AssetName { get; set; } = null!;
        public string? AssetSerialNumber { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public decimal? AssetValue { get; set; }
        public string Status { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? AssetAssignedTo { get; set; }
        public string? AssetType { get; set; }
    }
}