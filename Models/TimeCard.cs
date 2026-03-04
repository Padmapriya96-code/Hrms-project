using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class TimeCard
{
    public int Sno { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public string? EmpCode { get; set; }

    public string? EmpName { get; set; }

    public string? ShiftCode { get; set; }

    public DateTime? Dates { get; set; }

    public string? Days { get; set; }

    public DateTime? Intime { get; set; }

    public DateTime? BreakOut { get; set; }

    public DateTime? BreakIn { get; set; }

    public DateTime? EarlyOut { get; set; }

    public DateTime? Outtime { get; set; }

    public DateTime? LateIn { get; set; }

    public DateTime? LateOut { get; set; }

    public DateTime? OtHrs { get; set; }

    public string? Status { get; set; }

    public string? LeaveCode { get; set; }

    public string? Data { get; set; }

    public string? PnEmployeeId { get; set; }

    public string? Flag { get; set; }
}
