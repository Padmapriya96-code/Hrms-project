using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PayOutputActual
{
    public int PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public DateTime DDate { get; set; }

    public DateTime? DFromDate { get; set; }

    public DateTime? DToDate { get; set; }

    public double? EarnActAmount { get; set; }

    public double? DedActAmount { get; set; }

    public double? ActBasic { get; set; }

    public string? PeriodCode { get; set; }
}
