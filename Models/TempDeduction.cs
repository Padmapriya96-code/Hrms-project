using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class TempDeduction
{
    public int Id { get; set; }

    public int PnCompanyId { get; set; }

    public int PnEmployeeId { get; set; }

    public int PnDeductionId { get; set; }

    public string? PnDepartmentName { get; set; }

    public DateTime DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public string? Mode { get; set; }

    public string Flag { get; set; } = null!;

    public double? ActAmount { get; set; }

    public double? Amount { get; set; }

    public int? PnBranchId { get; set; }

    public string VDeductionname { get; set; } = null!;
}
