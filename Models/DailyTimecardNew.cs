using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class DailyTimecardNew
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public string? MachineNum { get; set; }

    public string? CardNo { get; set; }

    public string? EmpCode { get; set; }

    public string? EmpName { get; set; }

    public int? VerifyMode { get; set; }

    public int? InOutMode { get; set; }

    public string? ShiftCode { get; set; }

    public DateTime? Dates { get; set; }

    public string? Days { get; set; }

    public TimeOnly? Intime { get; set; }

    public TimeOnly? BreakOut { get; set; }

    public TimeOnly? BreakIn { get; set; }

    public TimeOnly? Outtime { get; set; }

    public DateTime? OtHrs { get; set; }

    public string? Status { get; set; }
}
