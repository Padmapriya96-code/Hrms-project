using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class AttendanceCeiling
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public TimeOnly? Intime { get; set; }

    public TimeOnly? EarlyIntime { get; set; }

    public TimeOnly? ShiftLin { get; set; }

    public TimeOnly? LunchEin { get; set; }

    public TimeOnly? Halfday { get; set; }

    public TimeOnly? OtLimit { get; set; }

    public TimeOnly? PermissionLimit { get; set; }

    public int? LeaveDays { get; set; }

    public string? MorningOt { get; set; }

    public string? MonthType { get; set; }

    public string? WeekOff1 { get; set; }

    public string? WeekOff2 { get; set; }

    public int? ManualDays { get; set; }

    public double? OtDays { get; set; }

    public double? OtHrs { get; set; }

    public string? TimeCard { get; set; }

    public string? PtaxMonth { get; set; }

    public string? ReaderName { get; set; }
}
