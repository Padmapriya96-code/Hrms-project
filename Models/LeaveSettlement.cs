using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class LeaveSettlement
{
    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public int? PnLeaveId { get; set; }

    public string PnLeavecode { get; set; } = null!;

    public int? DaysAllowed { get; set; }

    public int? DaysTaken { get; set; }

    public int? DaysBalance { get; set; }

    public string? Ec { get; set; }

    public string? Cf { get; set; }

    public int? MaxDays { get; set; }

    public string? Flag { get; set; }

    public string CalendarYear { get; set; } = null!;
}
