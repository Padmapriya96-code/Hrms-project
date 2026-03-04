using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class LeaveallocationMaster
{
    public int Id { get; set; }

    public int? PnCompanyId { get; set; }

    public int? PnBranchId { get; set; }

    public int? PnLeaveId { get; set; }

    public int? PnEmployeeId { get; set; }

    public string? Category { get; set; }

    public string? SubCategory { get; set; }

    public int? NCount { get; set; }

    public int? Yearend { get; set; }

    public int? Medical { get; set; }

    public int? Official { get; set; }

    public int? Casual { get; set; }

    public string? Ssss { get; set; }

    public string? Personnel { get; set; }

    public string? Personel { get; set; }

    public string? Maternity { get; set; }

    public string? Earned { get; set; }
}
