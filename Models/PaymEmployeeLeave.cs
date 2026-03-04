using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymEmployeeLeave
{
    public int Id { get; set; }

    public int PnCompanyId { get; set; }

    public int PnBranchId { get; set; }

    public int PnEmployeeId { get; set; }

    public int PnLeaveId { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string? FromStatus { get; set; }

    public string? ToStatus { get; set; }

    public double? LeaveCount { get; set; }
}
