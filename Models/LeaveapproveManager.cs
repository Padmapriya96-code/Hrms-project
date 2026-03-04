using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class LeaveapproveManager
{
    public int Sno { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int? EmpId { get; set; }

    public string? Empcode { get; set; }

    public string? EmpName { get; set; }

    public int? PnLeaveId { get; set; }

    public string? PnLeavecode { get; set; }

    public string? PnLeaveName { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public DateTime? SubmittedDate { get; set; }

    public string? FromStatus { get; set; }

    public string? ToStatus { get; set; }

    public string? Approve { get; set; }

    public string? YearEnd { get; set; }

    public int? Dayss { get; set; }

    public int? PnDesignationId { get; set; }
}
