using HRMSAPPLICATION.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public partial class PaymEmployeeProfile1
{
    public int Id { get; set; }

    public int? PnCompanyId { get; set; }
    public int? PnBranchId { get; set; }
    public int? PnEmployeeId { get; set; }
    public int? PnDivisionId { get; set; }
    public int? PnDepartmentId { get; set; }
    public int? PnDesingnationId { get; set; }
    public int? PnGradeId { get; set; }
    public int? PnShiftId { get; set; }
    public int? PnCategoryId { get; set; }
    public int? PnJobStatusId { get; set; }
    public int? PnLevelId { get; set; }
    public int? PnProjectsiteId { get; set; }
    public DateTime? d_Date { get; set; }
    public string? VReason { get; set; }
    public int? RDepartment { get; set; }

    [JsonIgnore]
    public byte[]? ImageData { get; set; }

    [NotMapped] // <-- Prevent EF mapping to DB
    [JsonPropertyName("imageData")]
    public string? ImageDataBase64
    {
        get => ImageData != null ? Convert.ToBase64String(ImageData) : null;
        set => ImageData = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
    }

    // Navigation properties omitted for brevity...
    public virtual PaymCategory? PaymCategory { get; set; }
    public virtual PaymDepartment? PaymDepartment { get; set; }

    public virtual PaymEmployee? PaymEmployee { get; set; }
}