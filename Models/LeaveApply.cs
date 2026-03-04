using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class LeaveApply
{
    public int Sno { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int? PnEmployeeId { get; set; }

    public string? EmpCode { get; set; }

    public string? EmpName { get; set; }

    public int? PnLeaveId { get; set; }

    public string? PnLeavename { get; set; }

    public string? PnLeavecode { get; set; }

    public DateTime? FromDate { get; set; }

    public string? FromStatus { get; set; }

    public DateTime? ToDate { get; set; }

    public string? Status { get; set; }

    public double? Days { get; set; }

    public string? Reason { get; set; }

    public DateTime? SubmittedDate { get; set; }

    public string? Approve { get; set; }

    public DateTime? Reminder { get; set; }

    public string? Priority { get; set; }

    public string? Comments { get; set; }

    public string? Record { get; set; }

    public string? Flag { get; set; }

    public int? Yearend { get; set; }
}
