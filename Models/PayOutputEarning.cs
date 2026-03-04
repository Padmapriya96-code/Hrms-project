using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayOutputEarning
{
    public int PnCompanyId { get; set; }

    public int PnEmployeeId { get; set; }

    public int PnEarningsId { get; set; }

    public string? PnDepartmentName { get; set; }

    public DateTime DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public string? Mode { get; set; }

    public string? Flag { get; set; }

    public double? ActAmount { get; set; }

    public double? Amount { get; set; }

    public int? PnBranchId { get; set; }
}
