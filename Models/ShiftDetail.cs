using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class ShiftDetail
{
    public int PnCompanyid { get; set; }

    public int PnBranchid { get; set; }

    public string ShiftCode { get; set; } = null!;

    public DateTime? StartTime { get; set; }

    public DateTime? BreakTimeOut { get; set; }

    public DateTime? BreakTimeIn { get; set; }

    public DateTime? EndTime { get; set; }

    public string? ShiftIndicator { get; set; }
}
