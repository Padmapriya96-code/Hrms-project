using System;
using System.Collections.Generic;

namespace HRMSAPPLICATION.Models;

public partial class ShiftBalance
{
    public int Id { get; set; }

    public int? PnCompanyid { get; set; }

    public int? PnBranchid { get; set; }

    public string? PnEmployeecode { get; set; }

    public string? PnEmployeename { get; set; }

    public string? Monthyear { get; set; }

    public string? PatternCode { get; set; }

    public int? Slot { get; set; }

    public int? BalanceDays { get; set; }

    public virtual ShiftPattern? ShiftPattern { get; set; }
}
