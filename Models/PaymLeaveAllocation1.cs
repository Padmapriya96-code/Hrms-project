using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class PaymLeaveAllocation1
{
    public int PnCompanyid { get; set; }

    public int PnBranchid { get; set; }

    public int PnLeaveid { get; set; }

    public int PnEmployeeid { get; set; }

    public double? NCount { get; set; }

    public double? CyCount { get; set; }

    public string? Leaveby { get; set; }

    public int Yearend { get; set; }
}
