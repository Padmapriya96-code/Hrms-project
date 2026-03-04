using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class SalaryPeriod
{
    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public string? PeriodCode { get; set; }

    public string? Selection { get; set; }

    public int? PYear { get; set; }

    public string? PMonth { get; set; }

    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int? TotalDays { get; set; }

    public DateTime? PayDate { get; set; }

    public string? OtInclude { get; set; }
}
